import { C as Context } from "./context-Xq2PPHJ1.js";
import { c } from "./context-Xq2PPHJ1.js";
import { c as createScope } from "./scope-Ch2w8axL.js";
function createView(html) {
  return html;
}
function createView2(html) {
  return html;
}
function createViewN(html) {
  return html;
}
function zipArgs(...lists) {
  const maxLength = lists.map((arr) => arr.length).reduce((a, b) => Math.max(a, b), 0);
  const range = Array.from(Array(maxLength).keys());
  return range.map((i) => lists.map((arr) => arr[i]));
}
function map(view, list) {
  return mapN(view, list);
}
function map2(view, ulist, vlist) {
  return mapN(view, ulist, vlist);
}
function mapN(view, ...lists) {
  if (!lists.length) return "";
  return zipArgs(...lists).map((tuple) => applyN(view, ...tuple)).flat();
}
function apply(view, t) {
  return typeof t === "undefined" ? "" : applyN(view, t);
}
function apply2(view, u, v) {
  return typeof u === "undefined" || typeof v === "undefined" ? "" : applyN(view, u, v);
}
function applyN(view, ...tuple) {
  if (!tuple) return "";
  const scope = createScope(tuple);
  return view.render(...scope);
}
const View = {
  apply,
  apply2,
  applyN,
  map,
  map2,
  mapN
};
function mapEntries(mapping) {
  return Object.entries(mapping).map(([k, v]) => [
    k,
    v
  ]);
}
class ViewModel extends Context {
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
    return template.render(this);
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
export {
  Context,
  View,
  ViewModel,
  c as createContext,
  createView,
  createView2,
  createViewModel,
  createViewN,
  fromAttributes,
  fromInputs
};
