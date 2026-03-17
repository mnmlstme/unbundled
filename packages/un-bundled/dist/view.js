import { C as Context } from "./context-Xq2PPHJ1.js";
import { c } from "./context-Xq2PPHJ1.js";
import { c as createScope } from "./scope-Ch2w8axL.js";
class MappedSource {
  constructor(source, mapping) {
    this.origin = source;
    const entries = mapEntries(mapping).map(([t, s]) => [s, t]);
    this.inverse = Object.fromEntries(entries);
  }
  mapObservation(source) {
    const entries = Object.entries(source);
    return Object.fromEntries(
      entries.map(([s, v]) => {
        const t = this.inverse[s];
        return [t, v];
      }).filter((pair) => pair.length > 0)
    );
  }
  start(fn) {
    const sfn = (s, value) => {
      const t = this.inverse[s];
      fn(t, value);
    };
    return this.origin.start(sfn).then((obs) => this.mapObservation(obs));
  }
}
function mapEntries(mapping) {
  return Object.entries(mapping).map(([k, v]) => [
    k,
    v
  ]);
}
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
class ViewModel extends Context {
  constructor(init, adoptedContext) {
    super(init, adoptedContext);
  }
  get $() {
    return this.toObject();
  }
  with(source, ...keys) {
    const mapping = Object.fromEntries(
      keys.map((k) => [k, k])
    );
    return this.merge(new MappedSource(source, mapping));
  }
  withCalculated(source, mapping) {
    return this.merge(new MappedSource(source, mapping));
  }
  withRenamed(source, renaming) {
    return this.merge(new MappedSource(source, renaming));
  }
  merge(source) {
    if (source) {
      const entries = source.start((name, value) => {
        console.log(
          "🪄 Merging effect",
          name,
          value,
          entries
        );
        this.set(name, value);
      }).then((firstObservation) => {
        console.log(
          "👀 ViewModel source observed:",
          firstObservation,
          entries
        );
        const keys = Object.keys(firstObservation);
        keys.forEach(
          (k) => this.set(k, firstObservation[k])
        );
      });
    }
    return this;
  }
  render(template) {
    return template.render(this);
  }
}
function createViewModel(init = {}) {
  return new ViewModel(init);
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
  MappedSource,
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
