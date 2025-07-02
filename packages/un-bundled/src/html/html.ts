import { createEffect } from "../effects/effects.ts";

const parser = new DOMParser();

export interface ViewTemplate<T extends object> extends DocumentFragment {
  render(init: T): DocumentFragment;
}

export type RenderResult<T extends object> =
  | string
  | boolean
  | number
  | ViewTemplate<T>;
export type RenderFunction<T extends object> = (data: T) => RenderResult<T>;

class HtmlEffect<T extends object> {
  fn: RenderFunction<T>;

  constructor(fn: RenderFunction<T>) {
    this.fn = fn;
    console.log("Creating HtmlEffect:", fn);
  }
}

export function fx<T extends object>(fn: RenderFunction<T>): HtmlEffect<T> {
  return new HtmlEffect(fn);
}

const OPEN_RE = /<[a-zA-z][$a-zA-Z0-9-]*\s+[^>]*$/;
const ATTR_RE = /^([^>]*)\s+([a-zA-Z-]+)=$/;
const CLOSE_RE = /^(\s+)?>/;

type Mutation = (site: HTMLElement) => void;
type Effector<T extends object> = (data: T, start: Node, end: Node) => void;

export function html<T extends object>(
  template: TemplateStringsArray,
  ...values: unknown[]
): ViewTemplate<T> {
  const tagOpeners = template.map((s) => Boolean(s.match(OPEN_RE)));
  const tagAttrs = template.map((s) => Boolean(s.match(ATTR_RE)));
  const tagClosers = template.map((s) => Boolean(s.match(CLOSE_RE)));
  const mutations: Map<string, Mutation[]> = new Map();
  const effectors: Map<string, Effector<T>[]> = new Map();
  const fragment = new DocumentFragment();

  function addMutation(key: string, fn: Mutation) {
    let list = mutations.get(key);
    if (list) list.push(fn);
    else mutations.set(key, [fn]);
  }

  function addEffector(key: string, fn: Effector<T>) {
    let list = effectors.get(key);
    if (list) list.push(fn);
    else effectors.set(key, [fn]);
  }

  console.log("tagOpeners:", tagOpeners);
  console.log("tagClosers:", tagClosers);
  console.log("tagInnards:", tagAttrs);
  console.log("template strings:", template);
  console.log("parameters:", values);

  const htmlString = template
    .map((s, i) => {
      if (i === values.length) return [s]; // no more parameters

      // inline any parameters we can, and set up for substitution

      if (!tagOpeners[i] && !tagAttrs[i]) {
        if (values[i] instanceof HtmlEffect) {
          const effect = values[i] as HtmlEffect<T>;
          const key = `data-un-effect-${i}`;
          addEffector(key, (viewModel: T, start: Node, end: Node) => {
            const rendered = effect.fn(viewModel);
            // console.log("Rendered effect:", rendered);
            const param = processAsNode(rendered);
            // console.log("Param processed:", param);
            console.log("Rendering effect into DocumentRange", start, end);
            const parent = start.parentNode;
            if (parent) {
              while (start.nextSibling && start.nextSibling !== end)
                parent.removeChild(start.nextSibling);
              parent.insertBefore(param, end);
            }
          });
          return [s, `<ins ${key}=""></ins>`];
        }
        let param = processAsNode(values[i]);
        if (param instanceof Node) {
          const key = `data-un-html-${i}`;
          addMutation(key, (site: HTMLElement) => {
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
          typeof attrValue === "undefined"
            ? (site: HTMLElement) => site.removeAttribute(attrName)
            : (site: HTMLElement) => site.setAttribute(attrName, attrValue)
        );
        return [upToName, ` ${key}="" `];
      }

      return [s];
    })
    .flat()
    .join("");
  const doc = parser.parseFromString(htmlString, "text/html");
  const collection = doc.head.childElementCount
    ? doc.head.children
    : doc.body.children;

  fragment.replaceChildren(...collection);

  mutations.forEach((list: Mutation[], key: string) => {
    const site = fragment.querySelector(`[${key}]`) as HTMLElement;
    console.log("Mutating ", key, site, list);
    if (site) {
      list.forEach((fn) => fn(site));
      delete site.dataset[key];
    }
  });

  return Object.assign(fragment, {
    effectors,
    render: (viewModel: T) => renderWithEffects(fragment, effectors, viewModel)
  });
}

function renderWithEffects<T extends object>(
  original: DocumentFragment,
  effectors: Map<string, Effector<T>[]>,
  viewModel: T
): DocumentFragment {
  const fragment = original.cloneNode(true) as DocumentFragment;
  effectors.forEach((list: Effector<T>[], key) => {
    const site = fragment.querySelector(`[${key}]`) as HTMLElement;
    if (site) {
      console.log("Rendering for effects on viewModel", viewModel);
      list.forEach((fn) => {
        const start = new Comment(` <<< ${key} `);
        const end = new Comment(` >>> ${key} `);
        const placeholder = new DocumentFragment();
        placeholder.replaceChildren(start, end);
        const parent = site.parentNode || fragment;
        parent.replaceChild(placeholder, site);
        createEffect<T>((d) => fn(d, start, end), viewModel);
      });
    }
  });
  return fragment;
}

function processAsNode(v: unknown): Node {
  if (v === null) return new Text("");

  switch (typeof v) {
    case "string":
      return new Text(v);
    case "bigint":
    case "boolean":
    case "number":
    case "symbol":
      // convert these to strings to make text nodes
      return new Text(v.toString());
    case "object":
      // turn arrays into DocumentFragments
      if (Array.isArray(v)) {
        const frag = new DocumentFragment();
        const elements = (v as Array<unknown>).map((node) =>
          processAsNode(node)
        );
        frag.replaceChildren(...elements);
        return frag;
      }
      if (v instanceof Node) return v;
      return new Text(JSON.stringify(v));
    default:
      // anything else, leave a comment node
      return new Comment(`[invalid type "${typeof v}"]`);
  }
}

function processAsAttribute(name: string, v: unknown): string | undefined {
  console.log("Processing attribute:", name, v);
  switch (typeof v) {
    case "object":
      if (Array.isArray(v)) return v.join(" ");
      if (name === "style") return formatAsCss(v as object);
      return JSON.stringify(v);
    case "boolean":
      return v ? "" : undefined;
    case "number":
      return v.toString();
    case "string":
      return v;
    default:
      return "";
  }
}

function formatAsCss(v: object): string {
  return Object.entries(v)
    .map(([prop, value]) => `${prop}:${value};`)
    .join("");
}
