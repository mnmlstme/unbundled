"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const context = require("./context-Dr0y4sel.cjs");
const scope = require("./scope-zXyY-M82.cjs");
function createView(html) {
  return html;
}
function zipArgs(...lists) {
  const maxLength = lists.map((arr) => arr.length).reduce((a, b) => Math.max(a, b), 0);
  const range = Array.from(Array(maxLength).keys());
  return range.map((i) => lists.map((arr) => arr[i]));
}
function map(view, ...lists) {
  if (!lists.length) return "";
  return zipArgs(...lists).map((tuple) => apply(view, tuple)).flat();
}
function apply(view, tuple) {
  if (!tuple) return "";
  const scope$1 = scope.createScope(tuple);
  return view(...scope$1);
}
function mapEntries(mapping) {
  return Object.entries(mapping).map(([k, v]) => [
    k,
    v
  ]);
}
class ViewModel extends context.Context {
  constructor(init, adoptedContext) {
    super(init, adoptedContext);
  }
  get $() {
    return this.toObject();
  }
  merge(source, mapping) {
    const entries = !Array.isArray(
      mapping
    ) ? mapEntries(mapping) : mapping.map(
      (m) => typeof m === "string" ? [[m, m]] : mapEntries(m)
    ).flat();
    if (source) {
      source.start((name, value) => {
        const pair = entries.find(([_, s]) => s === name);
        if (pair) this.set(pair[0], value);
      }).then((firstObservation) => {
        entries.forEach(
          ([t, s]) => this.set(t, firstObservation[s])
        );
      });
    }
    return this;
  }
  render(template) {
    return template(this);
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
exports.ViewModel = ViewModel;
exports.apply = apply;
exports.createView = createView;
exports.createViewModel = createViewModel;
exports.fromAttributes = fromAttributes;
exports.fromInputs = fromInputs;
exports.map = map;
