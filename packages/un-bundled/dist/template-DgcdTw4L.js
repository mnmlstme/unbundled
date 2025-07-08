class Mutation {
  constructor(place) {
    this.place = place;
  }
  apply(_site, _fragment) {
    throw "abstract method 'apply' called";
  }
}
class ElementContentMutation extends Mutation {
  constructor(place, content) {
    super(place);
    this.content = content;
  }
  apply(site, fragment) {
    const parent = site.parentNode || fragment;
    parent.replaceChild(site, this.content);
  }
}
class AttributeValueMutation extends Mutation {
  constructor(place, text) {
    super(place);
    this.text = text;
    this.name = place.attrName;
  }
  apply(site) {
    site.setAttribute(this.name, this.text);
  }
}
class TagContentMutation extends Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
  }
  apply(site) {
    this.fn(site);
  }
}
const _TemplateParser = class _TemplateParser {
  constructor(docType) {
    this.docType = "text/html";
    this.plugins = [];
    if (docType) this.docType = docType;
  }
  use(plugin) {
    this.plugins.push(plugin);
  }
  parse(template, params) {
    const postProcess = {};
    const stringToParse = template.map((s, i) => {
      if (i >= params.length) return [s];
      const param = params[i];
      const place = this.classifyPlace(i, template);
      const mutation = this.tryReplacements(place, param);
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
    }).flat().join("");
    const doc = _TemplateParser.parser.parseFromString(
      stringToParse,
      this.docType
    );
    const collection = doc.head.childElementCount ? doc.head.children : doc.body.children;
    const fragment = new DocumentFragment();
    fragment.replaceChildren(...collection);
    for (const label in postProcess) {
      const site = fragment.querySelector(`[data-${label}]`);
      if (site) {
        const mutations = postProcess[label];
        mutations.forEach((m) => m.apply(site, fragment));
      }
    }
    return Object.assign(fragment, {});
  }
  classifyPlace(i, template) {
    let prev = i;
    let tagOpen = null;
    while (prev >= 0 && !tagOpen) {
      tagOpen = template[prev].match(_TemplateParser.OPEN_RE);
      if (!tagOpen) {
        const tagContinue = template[prev].match(_TemplateParser.IN_TAG_RE);
        if (tagContinue) prev = prev - 1;
        else break;
      }
    }
    if (tagOpen) {
      const tagAttr = template[i].match(_TemplateParser.ATTR_RE);
      if (tagAttr)
        return {
          kind: "attr value",
          nodeLabel: `node${i}`,
          tagName: tagOpen[1],
          attrName: tagAttr[2]
        };
      return {
        kind: "tag content",
        nodeLabel: `node${i}`,
        tagName: tagOpen[1]
      };
    }
    return { kind: "element content", nodeLabel: `node${i}` };
  }
  tryReplacements(place, param) {
    const replacements = this.plugins.map((p) => p.replacements).flat().concat(_TemplateParser.basicReplacements);
    for (let i = 0; i < replacements.length; i++) {
      const sub = replacements[i];
      if (place.kind === sub.place && checkType(param, sub)) {
        const mutation = sub.mutator(place, param);
        return mutation;
      }
    }
    return void 0;
  }
};
_TemplateParser.parser = new DOMParser();
_TemplateParser.OPEN_RE = /<([a-zA-z][$a-zA-Z0-9-]*)\s+[^>]*$/;
_TemplateParser.IN_TAG_RE = /^(\s+|[^<>]*|"[^"]*"")*$/;
_TemplateParser.ATTR_RE = /^([^>]*)\s+([a-zA-Z-]+)=$/;
_TemplateParser.CLOSE_RE = /^(\s+)?>/;
_TemplateParser.basicReplacements = [
  {
    place: "element content",
    types: ["string", "number", "bigint", "symbol", "boolean"],
    mutator: (place, value) => new ElementContentMutation(place, new Text(value.toString()))
  },
  {
    place: "attr value",
    types: ["string", "number", "bigint", "symbol"],
    mutator: (place, value) => new AttributeValueMutation(
      place,
      value.toString()
    )
  },
  {
    place: "element content",
    types: (param) => param instanceof Node,
    mutator: (place, value) => new ElementContentMutation(place, value)
  }
];
let TemplateParser = _TemplateParser;
function checkType(param, sub) {
  if (typeof sub.types === "function") return sub.types(param, sub);
  return sub.types.includes(typeof param);
}
export {
  Mutation as M,
  TagContentMutation as T,
  TemplateParser as a
};
