"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const effects = require("./effects.cjs");
const template = require("./template-D9nobiMj.cjs");
const EVENT_PREFIX = "un-context";
const CONTEXT_CHANGE_EVENT = `${EVENT_PREFIX}:change`;
class Context {
  constructor(init, host) {
    this._proxy = createContext(init, host);
  }
  get value() {
    return this._proxy;
  }
  set value(next) {
    Object.assign(this._proxy, next);
  }
  apply(mapFn) {
    this.value = mapFn(this.value);
  }
}
function createContext(root, eventTarget) {
  let proxy = new Proxy(root, {
    get: (target, prop, receiver) => {
      if (prop === "then") {
        return void 0;
      }
      const value = Reflect.get(target, prop, receiver);
      console.log(`Context['${prop}'] => `, value);
      return value;
    },
    set: (target, prop, newValue, receiver) => {
      const oldValue = root[prop];
      console.log(
        `Context['${prop.toString()}'] <= `,
        newValue
      );
      const didSet = Reflect.set(
        target,
        prop,
        newValue,
        receiver
      );
      if (didSet) {
        let evt = new CustomEvent(CONTEXT_CHANGE_EVENT, {
          bubbles: true,
          cancelable: true,
          composed: true
        });
        Object.assign(evt, {
          property: prop,
          oldValue,
          value: newValue
        });
        eventTarget.dispatchEvent(evt);
      } else {
        console.log(
          `Context['${prop}] was not set to ${newValue}`
        );
      }
      return didSet;
    }
  });
  return proxy;
}
function createObservable(root) {
  const subscriptions = new effects.EffectsManager();
  let proxy = new Proxy(root, {
    get: (subject, prop, receiver) => {
      const value = Reflect.get(subject, prop, receiver);
      if (isObservable(value)) {
        subscriptions.subscribe(prop);
      }
      return value;
    },
    set: (subject, prop, newValue, receiver) => {
      const didSet = Reflect.set(subject, prop, newValue, receiver);
      if (didSet && isObservable(newValue)) {
        subscriptions.runEffects(prop, subject);
      }
      return didSet;
    }
  });
  return proxy;
}
function isObservable(value) {
  switch (typeof value) {
    case "object":
    case "number":
    case "string":
    case "boolean":
    case "undefined":
      return true;
    default:
      return false;
  }
}
function map(view, list) {
  return list.map(($) => view.render($));
}
class ElementContentEffect extends template.Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
  }
  apply(_, fragment) {
    const key = this.place.nodeLabel;
    registerEffect(
      fragment,
      key,
      (site, fragment2, viewModel) => {
        const start = new Comment(` <<< ${key} `);
        const end = new Comment(` >>> ${key} `);
        const placeholder = new DocumentFragment();
        placeholder.replaceChildren(start, end);
        const parent = site.parentNode || fragment2;
        parent.replaceChild(placeholder, site);
        console.log("Placeholder inserted:", parent);
        effects.createEffect((vm) => {
          const value = this.fn(vm);
          let node = value instanceof Node ? value : null;
          if (!node) {
            switch (typeof value) {
              case "string":
                node = new Text(value);
                break;
              case "number":
                node = new Text(value.toString());
                break;
              case "object":
                if (Array.isArray(value)) {
                  const frag = new DocumentFragment();
                  frag.replaceChildren(...value);
                  node = frag;
                }
            }
          }
          console.log("Rendered for view:", value, node);
          let p = start.nextSibling;
          while (p && p !== end) {
            parent.removeChild(p);
            p = start.nextSibling;
          }
          if (node) parent.insertBefore(node, end);
        }, viewModel);
      }
    );
  }
}
class AttributeEffect extends template.Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
    this.name = place.attrName;
  }
  apply(_site, fragment) {
    const key = this.place.nodeLabel;
    registerEffect(
      fragment,
      key,
      (site, _, viewModel) => {
        effects.createEffect((vm) => {
          const value = this.fn(vm);
          site.setAttribute(this.name, value.toString());
        }, viewModel);
      }
    );
  }
}
const viewReplacements = [
  {
    place: "element content",
    types: ["function"],
    mutator: (place, param) => {
      return new ElementContentEffect(place, param);
    }
  },
  {
    place: "attr value",
    types: ["function"],
    mutator: (place, param) => {
      return new AttributeEffect(place, param);
    }
  }
];
const parser = initializeParser();
function html(template2, ...params) {
  const fragment = parser.parse(template2, params);
  return Object.assign(fragment, {
    render: (data) => renderForEffects(fragment, data)
  });
}
function initializeParser() {
  const parser2 = new template.TemplateParser();
  const viewPlugin = {
    replacements: viewReplacements
  };
  parser2.use(viewPlugin);
  return parser2;
}
function registerEffect(template2, nodeLabel, fn) {
  if (!template2.effectors) template2.effectors = /* @__PURE__ */ new Map();
  let list = template2.effectors.get(nodeLabel);
  if (list) list.push(fn);
  else template2.effectors.set(nodeLabel, [fn]);
}
function renderForEffects(original, viewModel) {
  var _a;
  const fragment = original.cloneNode(true);
  (_a = original.effectors) == null ? void 0 : _a.forEach((list, key) => {
    const site = fragment.querySelector(`[data-${key}]`);
    if (site) {
      list.forEach((fn) => fn(site, fragment, viewModel));
    }
  });
  return fragment;
}
const View = {
  html,
  map
};
class ViewModel {
  constructor(init, adoptedProxy) {
    this.object = init;
    this.proxy = adoptedProxy || createObservable(this.object);
  }
  get(prop) {
    return this.proxy[prop];
  }
  set(prop, value) {
    this.proxy[prop] = value;
  }
  toObject() {
    return Object.assign({}, this.object);
  }
  merge(other, observer) {
    const merged = new ViewModel(
      Object.assign(this.object, other),
      this.proxy
    );
    if (observer) {
      const inputNames = Object.keys(other);
      observer.setEffect((name, value) => {
        if (inputNames.includes(name)) merged.set(name, value);
      });
    }
    return merged;
  }
  createEffect(fn) {
    effects.createEffect(fn, this.object);
  }
  render(view, scope = this.proxy) {
    console.log("Rendering view, scope=", scope);
    return view.render(scope);
  }
}
function createViewModel(init) {
  return new ViewModel(init || {});
}
function fromInputs(subject) {
  return new FromInputs(subject);
}
class FromInputs {
  constructor(subject) {
    subject.addEventListener("change", (event) => {
      const input = event.target;
      if (input && this.effectFn) {
        const name = input.name;
        const value = input.value;
        this.effectFn(name, value);
      }
    });
  }
  setEffect(fn) {
    this.effectFn = fn;
  }
}
exports.Context = Context;
exports.View = View;
exports.ViewModel = ViewModel;
exports.createContext = createContext;
exports.createObservable = createObservable;
exports.createViewModel = createViewModel;
exports.fromInputs = fromInputs;
