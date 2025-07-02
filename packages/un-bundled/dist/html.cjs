"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const effects = require("./effects.cjs");
function css(template, ...params) {
  const cssString = template.map((s, i) => i ? [params[i - 1], s] : [s]).flat().join("");
  let sheet = new CSSStyleSheet();
  sheet.replaceSync(cssString);
  return sheet;
}
function define(defns) {
  Object.entries(defns).map(([k, v]) => {
    if (!customElements.get(k)) customElements.define(k, v);
  });
  return customElements;
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
        addEffector(key, (viewModel, start, end) => {
          const rendered = effect.fn(viewModel);
          const param2 = processAsNode(rendered);
          console.log("Rendering effect into DocumentRange", start, end);
          const parent = start.parentNode;
          if (parent) {
            while (start.nextSibling && start.nextSibling !== end)
              parent.removeChild(start.nextSibling);
            parent.insertBefore(param2, end);
          }
        });
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
        const start = new Comment(` <<< ${key} `);
        const end = new Comment(` >>> ${key} `);
        const placeholder = new DocumentFragment();
        placeholder.replaceChildren(start, end);
        const parent = site.parentNode || fragment;
        parent.replaceChild(placeholder, site);
        effects.createEffect((d) => fn(d, start, end), viewModel);
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
exports.css = css;
exports.define = define;
exports.fx = fx;
exports.html = html;
exports.shadow = shadow;
