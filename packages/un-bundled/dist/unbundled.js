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
class HtmlEffect extends HTMLElement {
  constructor(viewFn) {
    super();
    this.effect = viewFn;
  }
  setEffect(effect) {
    this.effect = effect;
  }
  setEffectId(hash) {
    this.dataset.effectId = hash;
  }
  getEffectId() {
    return this.dataset.effectId;
  }
}
function html(template, ...values) {
  const params = values.map(processParam);
  const effects = params.filter((node) => node instanceof HtmlEffect).map((node, index) => {
    const hash = `effect-${index}`;
    const effect = node;
    effect.setEffectId(hash);
    return [hash, effect.effect];
  });
  const htmlString = template.map((s, i) => {
    if (i === 0) return [s];
    const node = params[i - 1];
    if (node instanceof Node)
      return [`<ins id="mu-html-${i - 1}"></ins>`, s];
    return [node, s];
  }).flat().join("");
  const doc = parser.parseFromString(htmlString, "text/html");
  const collection = doc.head.childElementCount ? doc.head.children : doc.body.children;
  const fragment = new DocumentFragment();
  fragment.replaceChildren(...collection);
  params.forEach((node, i) => {
    if (node instanceof Node) {
      const pos = fragment.querySelector(`ins#mu-html-${i}`);
      if (pos) {
        const parent = pos.parentNode;
        parent == null ? void 0 : parent.replaceChild(node, pos);
      } else {
        console.log(
          "Missing insertion point:",
          `ins#mu-html-${i}`
        );
      }
    }
  });
  return Object.assign(fragment, {
    effects: Object.fromEntries(effects)
  });
}
function processParam(v, _) {
  if (v === null) return "";
  switch (typeof v) {
    case "string":
      return escapeHtml(v);
    case "bigint":
    case "boolean":
    case "number":
    case "symbol":
      return escapeHtml(v.toString());
    case "object":
      if (Array.isArray(v)) {
        const frag = new DocumentFragment();
        const elements = v.map(
          processParam
        );
        frag.replaceChildren(...elements);
        return frag;
      }
      if (v instanceof Node) return v;
      return new Text(v.toString());
    default:
      return new Comment(
        `[invalid parameter of type "${typeof v}"]`
      );
  }
}
function cloneTemplate(view) {
  const clone = view.cloneNode(true);
  clone.querySelectorAll("unbundled-effect").forEach((node) => {
    const effect = node;
    const hash = effect.getEffectId();
    console.log("Cloning effect:", effect);
    if (hash) {
      const fn = view.effects[hash];
      effect.setEffect(fn);
    }
  });
  return Object.assign(clone, { effects: view.effects });
}
function escapeHtml(v) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
define({ "unbundled-effect": HtmlEffect });
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
export {
  HtmlEffect,
  cloneTemplate,
  css,
  define,
  html,
  shadow
};
