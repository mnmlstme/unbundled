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
  const parser = new DOMParser();
  function html(template, ...params) {
    const htmlString = template.map((s, i) => i ? [params[i - 1], s] : [s]).flat().join("");
    const doc = parser.parseFromString(htmlString, "text/html");
    const collection = doc.head.childElementCount ? doc.head.children : doc.body.children;
    const fragment = new DocumentFragment();
    fragment.replaceChildren(...collection);
    return fragment;
  }
  function shadow(el, options = { mode: "open" }) {
    const shadowRoot = el.attachShadow(options);
    const chain = { template, styles };
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
    }
  }
  exports2.css = css;
  exports2.html = html;
  exports2.shadow = shadow;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
