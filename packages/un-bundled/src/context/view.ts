import {
  AttributeValuePlace,
  DynamicDocumentFragment,
  ElementContentPlace,
  Mutation,
  Replacement,
  TemplateParameter,
  TemplateParser,
  TemplatePlugin,
  TemplateValue
} from "../html";
import { createEffect } from "../effects";

export default { map, html };

type Effector<T> = (
  site: Element,
  fragment: DocumentFragment,
  viewModel: T
) => void;

export interface ViewTemplate<T extends object>
  extends DynamicDocumentFragment {
  render(init: T): void;
  effectors?: Map<string, Array<Effector<T>>>;
}

function map<T extends object>(view: ViewTemplate<T>, list: Array<T>) {
  return list.map(($) => view.render($));
}

type RenderFunction<T extends object> = (data: T) => TemplateValue;

class ElementContentEffect<T extends object> extends Mutation {
  fn: RenderFunction<T>;

  constructor(place: ElementContentPlace, fn: RenderFunction<T>) {
    super(place);
    this.fn = fn;
  }

  override apply(_: Element, fragment: DynamicDocumentFragment): void {
    const key = this.place.nodeLabel;

    registerEffect(
      fragment as ViewTemplate<T>,
      key,
      (site: Element, fragment: DocumentFragment, viewModel: T) => {
        const start = new Comment(` <<< ${key} `);
        const end = new Comment(` >>> ${key} `);
        const placeholder = new DocumentFragment();
        placeholder.replaceChildren(start, end);
        const parent = site.parentNode || fragment;
        parent.replaceChild(placeholder, site);
        // console.log("Placeholder inserted:", parent);
        createEffect<T>((vm: T) => {
          const value = this.fn(vm);
          let node = value instanceof Node ? value : null;
          if (!node) {
            switch (typeof value) {
              case "string":
                node = new Text(value);
                break;
              case "number":
                node = new Text(value.toString());
                break;
              case "object":
                if (Array.isArray(value)) {
                  const frag = new DocumentFragment();
                  frag.replaceChildren(...value);
                  node = frag;
                }
            }
          }
          // console.log("Rendered for view:", value, node);
          let p = start.nextSibling;
          while (p && p !== end) {
            parent.removeChild(p);
            p = start.nextSibling;
          }
          if (node) parent.insertBefore(node, end);
        }, viewModel);
      }
    );
  }
}

class AttributeEffect<T extends object> extends Mutation {
  fn: RenderFunction<T>;
  name: string;

  constructor(place: AttributeValuePlace, fn: RenderFunction<T>) {
    super(place);
    this.fn = fn;
    this.name = place.attrName;
  }

  override apply(_site: Element, fragment: DocumentFragment): void {
    const key = this.place.nodeLabel;

    registerEffect(
      fragment as ViewTemplate<T>,
      key,
      (site: Element, _: DocumentFragment, viewModel: T) => {
        createEffect<T>((vm: T) => {
          const value = this.fn(vm);
          site.setAttribute(this.name, value.toString());
        }, viewModel);
      }
    );
  }
}

const viewReplacements: Array<Replacement> = [
  {
    place: "element content",
    types: ["function"],
    mutator: (place: ElementContentPlace, param: TemplateParameter) => {
      return new ElementContentEffect(place, param as RenderFunction<any>);
    }
  },
  {
    place: "attr value",
    types: ["function"],
    mutator: (place: AttributeValuePlace, param: TemplateParameter) => {
      return new AttributeEffect(place, param as RenderFunction<any>);
    }
  }
];

const parser = initializeParser();

function html<T extends object>(
  template: TemplateStringsArray,
  ...params: Array<TemplateParameter>
): ViewTemplate<T> {
  const fragment = parser.parse(template, params);

  return Object.assign(fragment, {
    render: (data: T) => renderForEffects(fragment as ViewTemplate<T>, data)
  });
}

function initializeParser() {
  const parser = new TemplateParser();
  const viewPlugin: TemplatePlugin = {
    replacements: viewReplacements
  };
  parser.use(viewPlugin);
  return parser;
}

function registerEffect<T extends object>(
  template: ViewTemplate<T>,
  nodeLabel: string,
  fn: Effector<T>
): void {
  if (!template.effectors) template.effectors = new Map();
  let list = template.effectors.get(nodeLabel);
  if (list) list.push(fn);
  else template.effectors.set(nodeLabel, [fn]);
}

function renderForEffects<T extends object>(
  original: ViewTemplate<T>,
  viewModel: T
): DocumentFragment {
  const fragment = original.cloneNode(true) as DocumentFragment;
  // console.log("Rendering for effects:", fragment);
  original.effectors?.forEach((list: Effector<T>[], key) => {
    // console.log("Looking for site:", key);
    const site = fragment.querySelector(`[data-${key}]`);
    if (site) {
      // console.log("Located site, running effects:", site);
      list.forEach((fn) => fn(site, fragment, viewModel));
    }
  });
  return fragment;
}

export const View = {
  html,
  map
};
