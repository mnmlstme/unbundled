import { a as createEffect, C as Context } from "./context-DxrrEInf.js";
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
function renderForEffects(fragment, effectors, ...scope) {
  effectors.forEach((list) => {
    list.forEach((fn) => fn(...scope));
  });
  return fragment;
}
const _TemplateParser = class _TemplateParser {
  constructor(docType) {
    this.docType = "text/html";
    this.plugins = [];
    if (docType) this.docType = docType;
  }
  use(plugin) {
    this.plugins = this.plugins.concat(plugin);
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
        throw `Failed to render template parameter ${i} around ${s}`;
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
    const effectors = /* @__PURE__ */ new Map();
    for (const label in postProcess) {
      const site = fragment.querySelector(
        `[data-${label}]`
      );
      if (site) {
        const mutations = postProcess[label];
        mutations.forEach((m) => {
          const effector = m.apply(site, fragment);
          if (effector) {
            let list = effectors.get(label);
            if (list) list.push(effector);
            else effectors.set(label, [effector]);
          }
        });
      }
    }
    return (...scope) => renderForEffects(fragment, effectors, ...scope);
  }
  classifyPlace(i, template) {
    let tagOpen = null;
    for (let prev = i; prev >= 0; prev--) {
      const tagEnd = template[prev].match(
        _TemplateParser.CLOSE_RE
      );
      if (tagEnd) break;
      tagOpen = template[prev].match(_TemplateParser.OPEN_RE);
      if (tagOpen) break;
      const tagContinue = template[prev].match(
        _TemplateParser.IN_TAG_RE
      );
      if (!tagContinue) break;
    }
    if (tagOpen) {
      const tagAttr = template[i].match(_TemplateParser.ATTR_RE);
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
  tryReplacements(place, param) {
    const replacements = this.plugins;
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
_TemplateParser.OPEN_RE = /<([a-zA-z][$a-zA-Z0-9.-]*)\s+[^>]*$/;
_TemplateParser.IN_TAG_RE = /^(\s+|[^<>]*|"[^"]*")*$/;
_TemplateParser.ATTR_RE = /([$.]?[a-zA-Z][$a-zA-Z0-9.-]*)=\s*$/;
_TemplateParser.CLOSE_RE = /[/]?>[^<]*$/;
let TemplateParser = _TemplateParser;
function checkType(param, sub) {
  if (typeof sub.types === "function")
    return sub.types(param, sub);
  return sub.types.includes(typeof param);
}
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
    parent.replaceChild(this.content, site);
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
class ElementContentEffect extends Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
  }
  apply(site, fragment) {
    const key = this.place.nodeLabel;
    const start = new Comment(` <<< ${key} `);
    const end = new Comment(` >>> ${key} `);
    const placeholder = new DocumentFragment();
    placeholder.replaceChildren(start, end);
    const parent = site.parentNode || fragment;
    parent.replaceChild(placeholder, site);
    return (...scope) => createEffect(
      (...args) => {
        const value = this.fn(...args);
        replaceElementContent(value, parent, start, end);
      },
      ...scope
    );
  }
}
function replaceElementContent(value, parent, start, end) {
  let node = value instanceof Node ? value : null;
  const valueToNode = (v) => node = new Text((v == null ? void 0 : v.toString()) || "");
  if (!node && Array.isArray(value)) {
    const frag = new DocumentFragment();
    const nodes = value.map(valueToNode);
    frag.replaceChildren(...nodes);
    node = frag;
  }
  let p = start.nextSibling;
  while (p && p !== end) {
    parent.removeChild(p);
    p = start.nextSibling;
  }
  if (node) parent.insertBefore(node, end);
}
class AttributeValueEffect extends Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
    this.name = place.attrName;
  }
  apply(site, _fragment) {
    return (...scope) => createEffect(
      (...args) => {
        const value = this.fn(...args);
        replaceAttributeValue(value, site, this.name);
      },
      ...scope
    );
  }
}
function replaceAttributeValue(value, site, attrName) {
  const special = attrName.match(/^([.$])(.+)$/);
  if (special) {
    const [_, pre, name] = special;
    switch (pre) {
      case ".":
        site[name] = value;
        break;
      case "$":
        if ("viewModel" in site && site.viewModel instanceof Context) {
          site.viewModel.set(name, value);
        }
        break;
    }
  } else {
    switch (typeof value) {
      case "string":
        site.setAttribute(attrName, value);
        break;
      case "undefined":
      case "object":
      case "boolean":
        if (value) site.setAttribute(attrName, attrName);
        else site.removeAttribute(attrName);
        break;
      default:
        site.setAttribute(attrName, value == null ? void 0 : value.toString());
    }
  }
}
class TagReferenceEffect extends Mutation {
  constructor(place, fn) {
    super(place);
    this.fn = fn;
  }
  apply(site, _fragment) {
    return (...scope) => createEffect(
      (...args) => {
        this.fn(site, ...args);
      },
      ...scope
    );
  }
}
const htmlParser = new TemplateParser();
htmlParser.use([
  {
    place: "element content",
    types: ["string", "number", "bigint", "symbol", "boolean"],
    mutator: (place, value) => new ElementContentMutation(
      place,
      new Text((value == null ? void 0 : value.toString()) || "")
    )
  },
  {
    place: "attr value",
    types: ["string", "number", "bigint", "symbol"],
    mutator: (place, value) => new AttributeValueMutation(
      place,
      (value == null ? void 0 : value.toString()) || ""
    )
  },
  {
    place: "element content",
    types: (param) => param instanceof Node,
    mutator: (place, value) => new ElementContentMutation(place, value)
  },
  {
    place: "element content",
    types: ["function"],
    mutator: (place, param) => new ElementContentEffect(place, param)
  },
  {
    place: "attr value",
    types: ["function"],
    mutator: (place, param) => new AttributeValueEffect(place, param)
  },
  {
    place: "tag content",
    types: ["function"],
    mutator: (place, param) => new TagReferenceEffect(place, param)
  }
]);
function html(template, ...params) {
  return htmlParser.parse(
    template,
    params
  );
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
  css,
  define,
  html,
  shadow
};
