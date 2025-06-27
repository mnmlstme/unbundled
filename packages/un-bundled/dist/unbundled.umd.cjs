(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.unbundled = {}));
})(this, function(exports2) {
  "use strict";
  function css(template, ...params) {
    const cssString = template.map((s, i) => i ? [params[i - 1], s] : [s]).flat().join("");
    let sheet = new CSSStyleSheet();
    sheet.replaceSync(cssString);
    return sheet;
  }
  function define2(defns) {
    Object.entries(defns).map(([k, v]) => {
      if (!customElements.get(k)) customElements.define(k, v);
    });
    return customElements;
  }
  const $context = [];
  function effectInContext() {
    const len = $context.length;
    return len ? $context[len - 1] : void 0;
  }
  function createEffect(fn, initialScope) {
    const effect = {
      execute(context) {
        $context.push(effect);
        fn(context);
        $context.pop();
      }
    };
    effect.execute(initialScope);
  }
  class EffectsManager {
    constructor() {
      this.signals = /* @__PURE__ */ new Map();
    }
    subscribe(key) {
      const effect = effectInContext();
      if (effect) {
        let signal = this.signals.get(key);
        if (!signal) this.signals.set(key, signal = /* @__PURE__ */ new Set());
        signal.add(effect);
      }
    }
    runEffects(key, scope) {
      const signal = this.signals.get(key);
      if (signal) {
        for (const effect of signal) {
          effect.execute(scope);
        }
      }
    }
  }
  const parser = new DOMParser();
  class HtmlEffect {
    constructor(fn) {
      this.fn = fn;
      console.log("Creating HtmlEffect:", fn);
    }
  }
  function fx(fn) {
    return new HtmlEffect(fn);
  }
  const OPEN_RE = /<[a-zA-z][$a-zA-Z0-9-]*\s+[^>]*$/;
  const ATTR_RE = /^([^>]*)\s+([a-zA-Z-]+)=$/;
  const CLOSE_RE = /^(\s+)?>/;
  function html(template, ...values) {
    const tagOpeners = template.map((s) => Boolean(s.match(OPEN_RE)));
    const tagAttrs = template.map((s) => Boolean(s.match(ATTR_RE)));
    const tagClosers = template.map((s) => Boolean(s.match(CLOSE_RE)));
    const mutations = /* @__PURE__ */ new Map();
    const effectors = /* @__PURE__ */ new Map();
    const fragment = new DocumentFragment();
    function addMutation(key, fn) {
      let list = mutations.get(key);
      if (list) list.push(fn);
      else mutations.set(key, [fn]);
    }
    function addEffector(key, fn) {
      let list = effectors.get(key);
      if (list) list.push(fn);
      else effectors.set(key, [fn]);
    }
    console.log("tagOpeners:", tagOpeners);
    console.log("tagClosers:", tagClosers);
    console.log("tagInnards:", tagAttrs);
    console.log("template strings:", template);
    console.log("parameters:", values);
    const htmlString = template.map((s, i) => {
      if (i === values.length) return [s];
      if (!tagOpeners[i] && !tagAttrs[i]) {
        if (values[i] instanceof HtmlEffect) {
          const effect = values[i];
          const key = `data-un-effect-${i}`;
          addEffector(
            key,
            (viewModel, site, fragment2) => {
              const parent = site.parentNode || fragment2;
              const rendered = effect.fn(viewModel);
              const param2 = processAsNode(rendered);
              parent.insertBefore(param2, site.nextSibling);
            }
          );
          return [s, `<ins ${key}=""></ins>`];
        }
        let param = processAsNode(values[i]);
        if (param instanceof Node) {
          const key = `data-un-html-${i}`;
          addMutation(key, (site) => {
            const parent = site.parentNode || fragment;
            parent.replaceChild(param, site);
          });
          return [s, `<ins ${key}=""></ins>`];
        }
        return [s, param];
      }
      const attrMatches = s.match(ATTR_RE);
      if (attrMatches) {
        const [_, upToName, attrName] = attrMatches;
        const key = `data-un-attr-${attrName}`;
        const attrValue = processAsAttribute(attrName, values[i]);
        addMutation(
          key,
          typeof attrValue === "undefined" ? (site) => site.removeAttribute(attrName) : (site) => site.setAttribute(attrName, attrValue)
        );
        return [upToName, ` ${key}="" `];
      }
      return [s];
    }).flat().join("");
    const doc = parser.parseFromString(htmlString, "text/html");
    const collection = doc.head.childElementCount ? doc.head.children : doc.body.children;
    fragment.replaceChildren(...collection);
    mutations.forEach((list, key) => {
      const site = fragment.querySelector(`[${key}]`);
      console.log("Mutating ", key, site, list);
      if (site) {
        list.forEach((fn) => fn(site));
        delete site.dataset[key];
      }
    });
    return Object.assign(fragment, {
      effectors,
      render: (viewModel) => renderWithEffects(fragment, effectors, viewModel)
    });
  }
  function renderWithEffects(original, effectors, viewModel) {
    const fragment = original.cloneNode(true);
    effectors.forEach((list, key) => {
      const site = fragment.querySelector(`[${key}]`);
      if (site) {
        console.log("Rendering for effects on viewModel", viewModel);
        list.forEach((fn) => {
          const placeholder = new Comment(`un-html: ${key}`);
          const parent = site.parentNode || fragment;
          parent.replaceChild(placeholder, site);
          createEffect((d) => fn(d, placeholder, fragment), viewModel);
        });
      }
    });
    return fragment;
  }
  function processAsNode(v) {
    if (v === null) return new Text("");
    switch (typeof v) {
      case "string":
        return new Text(v);
      case "bigint":
      case "boolean":
      case "number":
      case "symbol":
        return new Text(v.toString());
      case "object":
        if (Array.isArray(v)) {
          const frag = new DocumentFragment();
          const elements = v.map(
            (node) => processAsNode(node)
          );
          frag.replaceChildren(...elements);
          return frag;
        }
        if (v instanceof Node) return v;
        return new Text(JSON.stringify(v));
      default:
        return new Comment(`[invalid type "${typeof v}"]`);
    }
  }
  function processAsAttribute(name, v) {
    console.log("Processing attribute:", name, v);
    switch (typeof v) {
      case "object":
        if (Array.isArray(v)) return v.join(" ");
        if (name === "style") return formatAsCss(v);
        return JSON.stringify(v);
      case "boolean":
        return v ? "" : void 0;
      case "number":
        return v.toString();
      case "string":
        return v;
      default:
        return "";
    }
  }
  function formatAsCss(v) {
    return Object.entries(v).map(([prop, value]) => `${prop}:${value};`).join("");
  }
  function createObservable(root) {
    const subscriptions = new EffectsManager();
    let proxy = new Proxy(root, {
      get: (subject, prop, receiver) => {
        if (prop === "then") {
          return void 0;
        }
        const value = Reflect.get(subject, prop, receiver);
        if (isObservable(value)) {
          console.log("Observed: ", prop, value, subject);
          subscriptions.subscribe(prop);
        }
        return value;
      },
      set: (subject, prop, newValue, receiver) => {
        const didSet = Reflect.set(subject, prop, newValue, receiver);
        if (didSet && isObservable(newValue)) {
          console.log("Changed: ", prop, newValue, subject);
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
  function shadow(el, options = { mode: "open" }) {
    const shadowRoot = el.shadowRoot || el.attachShadow(options);
    const chain = { template, styles, replace };
    return chain;
    function template(fragment) {
      const first = fragment.firstElementChild;
      const template2 = first && first.tagName === "TEMPLATE" ? first : void 0;
      if (template2) {
        shadowRoot.appendChild(template2.content.cloneNode(true));
      }
      return chain;
    }
    function styles(...sheets) {
      shadowRoot.adoptedStyleSheets = sheets;
      return chain;
    }
    function replace(fragment) {
      shadowRoot.replaceChildren(fragment);
      return chain;
    }
  }
  class ViewModel {
    constructor(init) {
      this.proxy = createObservable(init);
    }
    get(prop) {
      return this.proxy[prop];
    }
    set(prop, value) {
      this.proxy[prop] = value;
    }
    render(view, scope = this.proxy) {
      return view.render(scope);
    }
    static map(view, list) {
      return list.map(($) => view.render($));
    }
  }
  exports2.EffectsManager = EffectsManager;
  exports2.ViewModel = ViewModel;
  exports2.createEffect = createEffect;
  exports2.createObservable = createObservable;
  exports2.css = css;
  exports2.define = define2;
  exports2.fx = fx;
  exports2.html = html;
  exports2.shadow = shadow;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
