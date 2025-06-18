import { define } from "./define.ts";

const parser = new DOMParser();

export interface ViewTemplate extends DocumentFragment {
  effects: { [hash: string]: ViewFn };
}

export type ViewFn = ($: object) => DocumentFragment;

export class HtmlEffect extends HTMLElement {
  effect: ViewFn;
  constructor( viewFn: ViewFn ) {
    super();

    this.effect = viewFn;
  }

  setEffect(effect: ViewFn) {
    this.effect = effect;
  }
  setEffectId(hash: string) {
    this.dataset.effectId = hash;
  }
  getEffectId(): string | undefined {
    return this.dataset.effectId;
  }
}

export function html(
  template: TemplateStringsArray,
  ...values: unknown[]
): ViewTemplate {
  const params = values.map(processParam);
  const effects = params
    .filter(node => node instanceof HtmlEffect)
    .map((node, index) => {
      const hash = `effect-${index}`;
      const effect = node as HtmlEffect;
      effect.setEffectId(hash)
      return [hash, effect.effect];
    });
  const htmlString = template
    .map((s, i) => {
      if (i === 0) return [s];

      const node = params[i - 1];
      if (node instanceof Node)
        return [`<ins id="mu-html-${i - 1}"></ins>`, s];
      return [node, s];
    })
    .flat()
    .join("");
  const doc = parser.parseFromString(htmlString, "text/html");
  const collection = doc.head.childElementCount
    ? doc.head.children
    : doc.body.children;
  const fragment = new DocumentFragment();

  fragment.replaceChildren(...collection);

  params.forEach((node, i) => {
    if (node instanceof Node) {
      const pos = fragment.querySelector(`ins#mu-html-${i}`);

      if (pos) {
        const parent = pos.parentNode;
        parent?.replaceChild(node, pos);
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

function processParam(v: unknown, _: number): Node | string {
  if (v === null) return "";

  switch (typeof v) {
    case "string":
      return escapeHtml(v);
    case "bigint":
    case "boolean":
    case "number":
    case "symbol":
      // convert these to strings to make text nodes
      return escapeHtml(v.toString());
    case "object":
      // turn arrays into DocumentFragments
      if (Array.isArray(v)) {
        const frag = new DocumentFragment();
        const elements = (v as Array<unknown>).map(
          processParam
        );
        frag.replaceChildren(...elements);
        return frag;
      }
      if (v instanceof Node) return v;
      return new Text(v.toString());
    default:
      // anything else, leave a comment node
      return new Comment(
        `[invalid parameter of type "${typeof v}"]`
      );
  }
}

export function cloneTemplate(view: ViewTemplate): ViewTemplate {
  const clone: DocumentFragment = view.cloneNode(true) as DocumentFragment;

  clone.querySelectorAll("unbundled-effect")
    .forEach((node) => {
      const effect = node as HtmlEffect;
      const hash = effect.getEffectId();
      console.log("Cloning effect:", effect);
      if (hash) {
        const fn = view.effects[hash];
        effect.setEffect(fn);
      }
    })

  return Object.assign(clone, { effects: view.effects });
}

function escapeHtml(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

define({ "unbundled-effect": HtmlEffect });
