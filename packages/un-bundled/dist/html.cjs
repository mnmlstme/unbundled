"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const template = require("./template-c79EwCZk.cjs");
function css(template2, ...params) {
  const cssString = template2.map((s, i) => i ? [params[i - 1], s] : [s]).flat().join("");
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
const parser = new template.TemplateParser();
function html(template2, ...params) {
  return parser.parse(template2, params);
}
function listen(element, map) {
  for (const eventType in map) {
    element.addEventListener(eventType, map[eventType]);
  }
}
function delegate(element, selector, map) {
  for (const eventType in map) {
    const listener = function(ev) {
      const target = ev.target;
      if (target && target instanceof HTMLElement && target.matches(selector)) {
        map[eventType](ev);
      }
    };
    element.addEventListener(eventType, listener);
  }
}
const Events = {
  listen,
  delegate
};
function shadow(el, options = { mode: "open" }) {
  const shadowRoot = el.shadowRoot || el.attachShadow(options);
  const chain = {
    template: template2,
    styles,
    replace,
    root: shadowRoot,
    delegate: delegate2,
    listen: listen2
  };
  return chain;
  function template2(fragment) {
    const first = fragment.firstElementChild;
    const template22 = first && first.tagName === "TEMPLATE" ? first : void 0;
    if (template22) {
      shadowRoot.appendChild(template22.content.cloneNode(true));
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
  function listen2(map) {
    Events.listen(shadowRoot, map);
    return chain;
  }
  function delegate2(selector, map) {
    Events.delegate(shadowRoot, selector, map);
    return chain;
  }
}
exports.Mutation = template.Mutation;
exports.TagContentMutation = template.TagContentMutation;
exports.TemplateParser = template.TemplateParser;
exports.css = css;
exports.define = define;
exports.html = html;
exports.shadow = shadow;
