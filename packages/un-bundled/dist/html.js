import { a as TemplateParser } from "./template-B9lxuhGz.js";
import { M, T } from "./template-B9lxuhGz.js";
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
const parser = new TemplateParser();
function html(template, ...params) {
  return parser.parse(template, params);
}
function shadow(el, options = { mode: "open" }) {
  const shadowRoot = el.shadowRoot || el.attachShadow(options);
  const chain = { template, styles, replace, root: shadowRoot };
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
export {
  M as Mutation,
  T as TagContentMutation,
  TemplateParser,
  css,
  define,
  html,
  shadow
};
