"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const context = require("./context-Bd2U9W3u.cjs");
const template = require("./template-_2CniEel.cjs");
function map(view, list) {
  return list.map(($) => {
    const context$1 = new context.Context($);
    view.render(context$1);
  });
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
        viewModel.createEffect((vm) => {
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
          let p = start.nextSibling;
          while (p && p !== end) {
            parent.removeChild(p);
            p = start.nextSibling;
          }
          if (node) parent.insertBefore(node, end);
        });
      }
    );
  }
}
class AttributeEffect extends template.Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
    this.name = place.attrName;
    console.log("Created new attribute effect", this);
  }
  apply(_site, fragment) {
    const key = this.place.nodeLabel;
    console.log("Applying AttributeEffect", this);
    registerEffect(
      fragment,
      key,
      (site, _, viewModel) => {
        console.log("Creating effect for AttributeEffect", this, site);
        viewModel.createEffect((vm) => {
          const value = this.fn(vm);
          site.setAttribute(this.name, value.toString());
        });
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
    render: (context2) => renderForEffects(fragment, context2)
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
class ViewModel extends context.Context {
  constructor(init, adoptedContext) {
    super(init, adoptedContext);
  }
  html(template2, ...params) {
    const view = View.html(template2, ...params);
    return this.render(view);
  }
  merge(other, source) {
    const merged = new ViewModel(
      Object.assign(this.toObject(), other),
      this
    );
    if (source) {
      const inputNames = Object.keys(other);
      source.start((name, value) => {
        console.log("Merging effect", name, value, inputNames);
        if (inputNames.includes(name)) merged.set(name, value);
      }).then((firstObservation) => {
        console.log("ViewModel source observed:", firstObservation);
        merged.update(firstObservation);
      });
    }
    return merged;
  }
  render(view) {
    console.log("Rendering view, scope=", this.toObject());
    return view.render(this);
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
    this.subject = subject;
  }
  start(fn) {
    this.subject.addEventListener("change", (event) => {
      const input = event.target;
      if (input) {
        const name = input.name;
        const value = input.value;
        fn(name, value);
      }
    });
    return new Promise((_resolve, _reject) => {
    });
  }
}
exports.Context = context.Context;
exports.createContext = context.createContext;
exports.View = View;
exports.ViewModel = ViewModel;
exports.createViewModel = createViewModel;
exports.fromInputs = fromInputs;
