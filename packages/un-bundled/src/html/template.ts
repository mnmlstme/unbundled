export interface DynamicDocumentFragment extends DocumentFragment {}

export interface TemplatePlaceHolder {}

export type TemplateValue = string | number | boolean | object | Node;
export type TemplateParameter = TemplateValue | TemplatePlaceHolder;

type KindOfPlace = "element content" | "attr value" | "tag content";

type Place<K extends KindOfPlace> = {
  kind: K;
  nodeLabel: string;
};

export interface ElementContentPlace extends Place<"element content"> {}

export interface AttributeValuePlace extends Place<"attr value"> {
  tagName: string;
  attrName: string;
}

export interface TagContentPlace extends Place<"tag content"> {
  tagName: string;
}

type ReplacementPlace =
  | ElementContentPlace
  | AttributeValuePlace
  | TagContentPlace;

export class Mutation {
  place: ReplacementPlace;
  constructor(place: ReplacementPlace) {
    this.place = place;
  }
  apply(_site: Element, _fragment: DynamicDocumentFragment): void {
    throw "abstract method 'apply' called";
  }
}

class ElementContentMutation extends Mutation {
  content: Node;

  constructor(place: ElementContentPlace, content: Node) {
    super(place);
    this.content = content;
  }

  override apply(site: Element, fragment: DocumentFragment): void {
    const parent: Node = site.parentNode || fragment;
    parent.replaceChild(site, this.content);
  }
}

class AttributeValueMutation extends Mutation {
  text: string;
  name: string;

  constructor(place: AttributeValuePlace, text: string) {
    super(place);
    this.text = text;
    this.name = place.attrName;
  }

  override apply(site: Element): void {
    site.setAttribute(this.name, this.text);
  }
}

export type TagMutationFunction = (site: Element) => void;

export class TagContentMutation extends Mutation {
  fn: TagMutationFunction;

  constructor(place: TagContentPlace, fn: TagMutationFunction) {
    super(place);
    this.fn = fn;
  }

  override apply(site: Element): void {
    this.fn(site);
  }
}

type TypeCheckFunction = (
  param: TemplateParameter,
  sub: Replacement
) => boolean;

export interface Replacement {
  place: KindOfPlace;
  types: Array<string> | TypeCheckFunction;
  mutator(place: ReplacementPlace, value: TemplateParameter): Mutation;
}

export interface TemplatePlugin {
  replacements: Array<Replacement>;
}

export class TemplateParser {
  static parser = new DOMParser();
  docType: DOMParserSupportedType = "text/html";
  plugins: Array<TemplatePlugin> = [];

  constructor(docType?: DOMParserSupportedType) {
    if (docType) this.docType = docType;
  }

  use(plugin: TemplatePlugin) {
    this.plugins.push(plugin);
  }

  parse(
    template: TemplateStringsArray,
    params: Array<TemplateParameter>
  ): DynamicDocumentFragment {
    const postProcess: { [node: string]: Array<Mutation> } = {};
    const stringToParse = template
      .map((s, i) => {
        if (i >= params.length) return [s]; // no more parameters
        const param = params[i];
        const place = this.classifyPlace(i, template);
        const mutation = this.tryReplacements(place, param);
        // console.log("Place mutation:", i, place, mutation);
        if (mutation) {
          const post = postProcess[place.nodeLabel];
          if (post) post.push(mutation);
          else postProcess[place.nodeLabel] = [mutation];
          switch (place.kind) {
            case "attr value":
              return [s, `"" data-${place.nodeLabel}`];
            case "tag content":
              return [s, `data-${place.nodeLabel}`];
            case "element content":
              return [s, `<ins data-${place.nodeLabel}></ins>`];
          }
        } else {
          console.log("Failed to render template parameter: ", i, s, param);
        }
        return [s];
      })
      .flat()
      .join("");

    const doc = TemplateParser.parser.parseFromString(
      stringToParse,
      this.docType
    );

    const collection = doc.head.childElementCount
      ? doc.head.children
      : doc.body.children;
    const fragment = new DocumentFragment();
    fragment.replaceChildren(...collection);

    for (const label in postProcess) {
      const site: Element | null = fragment.querySelector(`[data-${label}]`);
      if (site) {
        const mutations = postProcess[label];
        mutations.forEach((m) => m.apply(site, fragment));
      }
    }

    return Object.assign(fragment, {});
  }

  static OPEN_RE = /<([a-zA-z][$a-zA-Z0-9-]*)\s+[^>]*$/;
  static IN_TAG_RE = /^(\s+|[^<>]*|"[^"]*")*$/;
  static ATTR_RE = /([a-zA-Z-]+)=\s*$/;
  static CLOSE_RE = /[/]?>[^<]*$/;

  classifyPlace(i: number, template: TemplateStringsArray): ReplacementPlace {
    let tagOpen = null;
    // console.log("Classifying place", i, template);
    for (let prev = i; prev >= 0; prev--) {
      const tagEnd = template[prev].match(TemplateParser.CLOSE_RE);
      if (tagEnd) break;
      tagOpen = template[prev].match(TemplateParser.OPEN_RE);
      if (tagOpen) break;
      const tagContinue = template[prev].match(TemplateParser.IN_TAG_RE);
      if (!tagContinue) break;
    }
    if (tagOpen) {
      // console.log("Checking for attributes in open tag", template[i], tagOpen);
      const tagAttr = template[i].match(TemplateParser.ATTR_RE);
      if (tagAttr)
        return {
          kind: "attr value",
          nodeLabel: `node${i}`,
          tagName: tagOpen[1],
          attrName: tagAttr[1]
        };
      return {
        kind: "tag content",
        nodeLabel: `node${i}`,
        tagName: tagOpen[1]
      };
    }
    return { kind: "element content", nodeLabel: `node${i}` };
  }

  tryReplacements(
    place: ReplacementPlace,
    param: TemplateParameter
  ): Mutation | undefined {
    const replacements = this.plugins
      .map((p) => p.replacements)
      .flat()
      .concat(TemplateParser.basicReplacements);
    for (let i = 0; i < replacements.length; i++) {
      const sub = replacements[i];
      if (place.kind === sub.place && checkType(param, sub)) {
        const mutation = sub.mutator(place, param);
        // console.log("Using Mutation", sub, mutation);
        return mutation;
      }
    }
    return undefined;
  }

  static basicReplacements: Array<Replacement> = [
    {
      place: "element content",
      types: ["string", "number", "bigint", "symbol", "boolean"],
      mutator: (place: ElementContentPlace, value: TemplateParameter) =>
        new ElementContentMutation(place, new Text(value.toString()))
    },
    {
      place: "attr value",
      types: ["string", "number", "bigint", "symbol"],
      mutator: (place: AttributeValuePlace, value: TemplateParameter) =>
        new AttributeValueMutation(
          place as AttributeValuePlace,
          value.toString()
        )
    },
    {
      place: "element content",
      types: (param: TemplateParameter) => param instanceof Node,
      mutator: (place: ElementContentPlace, value: TemplateParameter) =>
        new ElementContentMutation(place, value as Node)
    }
  ];
}

function checkType(param: TemplateParameter, sub: Replacement): boolean {
  if (typeof sub.types === "function") return sub.types(param, sub);
  return sub.types.includes(typeof param);
}
