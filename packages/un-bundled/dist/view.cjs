"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const context = require("./context-DycUTdK3.cjs");
const template = require("./template-Dj3CUNbv.cjs");
function createView(html2) {
  return html2;
}
function map(view, list) {
  return list.map(($) => {
    const context$1 = new context.Context($);
    return view.render(context$1);
  });
}
function apply(view, $) {
  if (!$) return "";
  const context$1 = new context.Context($);
  return view.render(context$1);
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
          const value = this.fn(vm, site);
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
  }
  apply(_site, fragment) {
    const key = this.place.nodeLabel;
    registerEffect(
      fragment,
      key,
      (site, _, viewModel) => {
        viewModel.createEffect((vm) => {
          const value = this.fn(vm, site);
          switch (typeof value) {
            case "string":
              site.setAttribute(this.name, value);
              break;
            case "undefined":
            case "boolean":
              if (value) site.setAttribute(this.name, this.name);
              else site.removeAttribute(this.name);
              break;
            default:
              site.setAttribute(this.name, value.toString());
          }
        });
      }
    );
  }
}
class TagEffect extends template.Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
  }
  apply(_site, fragment) {
    const key = this.place.nodeLabel;
    registerEffect(
      fragment,
      key,
      (site, _, viewModel) => {
        console.log("Creating effect for TagEffect", this, site);
        viewModel.createEffect((vm) => {
          this.fn(vm, site);
        });
      }
    );
  }
}
const viewReplacements = [
  {
    place: "element content",
    types: ["function"],
    mutator: (place, param) => new ElementContentEffect(place, param)
  },
  {
    place: "attr value",
    types: ["function"],
    mutator: (place, param) => new AttributeEffect(place, param)
  },
  {
    place: "tag content",
    types: ["function"],
    mutator: (place, param) => new TagEffect(place, param)
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
  apply,
  html,
  map
};
class ViewModel extends context.Context {
  constructor(init, adoptedContext) {
    super(init, adoptedContext);
  }
  get $() {
    return this.toObject();
  }
  merge(other, source) {
    const merged = new ViewModel(
      Object.assign(this.toObject(), other),
      this
    );
    if (source) {
      const inputNames = Object.keys(other);
      source.start((name, value) => {
        if (inputNames.includes(name)) merged.set(name, value);
      }).then((firstObservation) => {
        merged.update(firstObservation);
      });
    }
    return merged;
  }
  render(view) {
    return view.render(this);
  }
}
function createViewModel(init) {
  return new ViewModel(init || {});
}
function fromAttributes(subject) {
  return new FromAttributes(subject);
}
class FromAttributes {
  constructor(subject) {
    this.subject = subject;
  }
  start(fn) {
    const observer = new MutationObserver(effectChanges);
    const element = this.subject;
    observer.observe(element, { attributes: true });
    console.log("Observing attributes of", element);
    return new Promise((resolve, _reject) => {
      const init = {};
      const attributes = element.attributes;
      for (const attr of attributes) {
        init[attr.name] = attr.value;
      }
      resolve(init);
    });
    function effectChanges(mutations) {
      mutations.forEach((mut) => {
        const name = mut.attributeName;
        const value = element.getAttribute(name);
        console.log("Mutation!", name, value);
        fn(name, value);
      });
    }
  }
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
exports.createView = createView;
exports.createViewModel = createViewModel;
exports.fromAttributes = fromAttributes;
exports.fromInputs = fromInputs;
