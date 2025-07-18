"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const template = require("./template-_2CniEel.cjs");
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
function shadow(el, options = { mode: "open" }) {
  const shadowRoot = el.shadowRoot || el.attachShadow(options);
  const chain = { template: template2, styles, replace, root: shadowRoot };
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
}
exports.Mutation = template.Mutation;
exports.TagContentMutation = template.TagContentMutation;
exports.TemplateParser = template.TemplateParser;
exports.css = css;
exports.define = define;
exports.html = html;
exports.shadow = shadow;
