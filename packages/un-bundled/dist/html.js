import { a as TemplateParser } from "./template-BtDRK3Hy.js";
import { M, T } from "./template-BtDRK3Hy.js";
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
function listen(element, map) {
  for (const eventType in map) {
    element.addEventListener(eventType, map[eventType]);
  }
}
function delegate(element, selector, map) {
  for (const eventType in map) {
    const listener = function(ev) {
      const target = ev.target;
      const match = target && target instanceof HTMLElement && (target.matches(selector) || element.contains(target.closest(selector)));
      if (match) map[eventType](ev);
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
    template,
    styles,
    replace,
    root: shadowRoot,
    delegate: delegate2,
    listen: listen2
  };
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
  function listen2(map) {
    Events.listen(shadowRoot, map);
    return chain;
  }
  function delegate2(selector, map) {
    Events.delegate(shadowRoot, selector, map);
    return chain;
  }
}
export {
  Events,
  M as Mutation,
  T as TagContentMutation,
  TemplateParser,
  css,
  define,
  html,
  shadow
};
