import {
  AttributeValuePlace,
  DynamicDocumentFragment,
  ElementContentPlace,
  TagContentPlace,
  Mutation,
  Replacement,
  TemplateParameter,
  TemplateParser,
  TemplatePlugin,
  TemplateValue
} from "../html";
import { Context } from "../effects";

export default { map, html };

type Effector<T extends object> = (
  site: Element,
  fragment: DocumentFragment,
  viewModel: Context<T>
) => void;

export interface ViewTemplate<T extends object>
  extends DynamicDocumentFragment {
  render(context: Context<T>): DynamicDocumentFragment;
  effectors?: Map<string, Array<Effector<T>>>;
}

export type RenderFunction<T extends object> = (
  data: T,
  el: Element
) => TemplateValue;

function map<T extends object>(view: ViewTemplate<T>, list: Array<T>) {
  return list.map(($) => {
    const context = new Context<T>($);
    view.render(context);
  });
}

function apply<T extends object>(view: ViewTemplate<T>, $: T | undefined) {
  if (!$) return "";

  const context = new Context<T>($);
  return view.render(context);
}

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
      (site: Element, fragment: DocumentFragment, viewModel: Context<T>) => {
        const start = new Comment(` <<< ${key} `);
        const end = new Comment(` >>> ${key} `);
        const placeholder = new DocumentFragment();
        placeholder.replaceChildren(start, end);
        const parent = site.parentNode || fragment;
        parent.replaceChild(placeholder, site);
        // console.log("Placeholder inserted:", parent);
        viewModel.createEffect((vm: T) => {
          const value = this.fn(vm, site);
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
        });
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
    // console.log("Created new attribute effect", this);
  }

  override apply(_site: Element, fragment: DynamicDocumentFragment): void {
    const key = this.place.nodeLabel;

    // console.log("Applying AttributeEffect", this);
    registerEffect(
      fragment as ViewTemplate<T>,
      key,
      (site: Element, _: DocumentFragment, viewModel: Context<T>) => {
        // console.log("Creating effect for AttributeEffect", this, site);
        viewModel.createEffect((vm: T) => {
          const value = this.fn(vm, site);
          switch (typeof value) {
            case "string":
              site.setAttribute(this.name, value);
              break;
            case "undefined":
            case "boolean":
              if (value) site.setAttribute(this.name, this.name);
              else site.removeAttribute(this.name);
              break;
            default:
              site.setAttribute(this.name, value.toString());
          }
        });
      }
    );
  }
}

class TagEffect<T extends object> extends Mutation {
  fn: RenderFunction<T>;

  constructor(place: TagContentPlace, fn: RenderFunction<T>) {
    super(place);
    this.fn = fn;
    console.log("Created new tag effect", this);
  }

  override apply(_site: Element, fragment: DynamicDocumentFragment): void {
    const key = this.place.nodeLabel;

    console.log("Applying TagEffect", this);
    registerEffect(
      fragment as ViewTemplate<T>,
      key,
      (site: Element, _: DocumentFragment, viewModel: Context<T>) => {
        console.log("Creating effect for TagEffect", this, site);
        viewModel.createEffect((vm: T) => {
          this.fn(vm, site);
        });
      }
    );
  }
}

const viewReplacements: Array<Replacement> = [
  {
    place: "element content",
    types: ["function"],
    mutator: (place: ElementContentPlace, param: TemplateParameter) =>
      new ElementContentEffect(place, param as RenderFunction<any>)
  },
  {
    place: "attr value",
    types: ["function"],
    mutator: (place: AttributeValuePlace, param: TemplateParameter) =>
      new AttributeEffect(place, param as RenderFunction<any>)
  },
  {
    place: "tag content",
    types: ["function"],
    mutator: (place: TagContentPlace, param: TemplateParameter) =>
      new TagEffect(place, param as RenderFunction<any>)
  }
];

const parser = initializeParser();

function html<T extends object>(
  template: TemplateStringsArray,
  ...params: Array<TemplateParameter | RenderFunction<T>>
): ViewTemplate<T> {
  const fragment = parser.parse(template, params);

  return Object.assign(fragment, {
    render: (context: Context<T>) =>
      renderForEffects(fragment as ViewTemplate<T>, context)
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
  viewModel: Context<T>
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
  apply,
  html,
  map
};
