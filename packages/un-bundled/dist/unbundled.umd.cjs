(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.unbundled = {}));
})(this, function(exports2) {
  "use strict";
  const parser = new DOMParser();
  function html(template, ...params) {
    const htmlString = template.map((s, i) => i ? [params[i - 1], s] : [s]).flat().join("");
    const doc = parser.parseFromString(htmlString, "text/html");
    const collection = doc.head.childElementCount ? doc.head.children : doc.body.children;
    const fragment = new DocumentFragment();
    fragment.replaceChildren(...collection);
    return fragment;
  }
  function shadow(fragment) {
    const first = fragment.firstElementChild;
    const template = first && first.tagName === "TEMPLATE" ? first : void 0;
    return { attach };
    function attach(el, options = { mode: "open" }) {
      const shadow2 = el.attachShadow(options);
      if (template) shadow2.appendChild(template.content.cloneNode(true));
      return shadow2;
    }
  }
  exports2.html = html;
  exports2.shadow = shadow;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
