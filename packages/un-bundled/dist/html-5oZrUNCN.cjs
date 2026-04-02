const require_effects = require("./effects-CdhxP8WC.cjs");
//#region src/html/css.ts
function css(template, ...params) {
	const cssString = template.map((s, i) => i ? [params[i - 1], s] : [s]).flat().join("");
	let sheet = new CSSStyleSheet();
	sheet.replaceSync(cssString);
	return sheet;
}
//#endregion
//#region src/html/define.ts
function define(defns) {
	Object.entries(defns).map(([k, v]) => {
		if (!customElements.get(k)) customElements.define(k, v);
	});
	return customElements;
}
//#endregion
//#region src/html/template.ts
function createTemplate(fragment, render) {
	Object.assign(fragment, { render });
	return fragment;
}
//#endregion
//#region src/html/render.ts
function renderForEffects(original, effectors, ...scope) {
	const fragment = original.cloneNode(true);
	Array.from(effectors.entries()).forEach(([label, mutations]) => {
		const site = fragment.querySelector(`[data-${label}]`);
		if (site) mutations.forEach((fn) => fn(site, fragment, ...scope));
	});
	return fragment;
}
//#endregion
//#region src/html/parser.ts
var TemplateParser = class TemplateParser {
	static {
		this.parser = new DOMParser();
	}
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
					case "attr value": return [s, `"" data-${place.nodeLabel}`];
					case "tag content": return [s, `data-${place.nodeLabel}`];
					case "element content": return [s, `<ins data-${place.nodeLabel}></ins>`];
				}
			} else {
				console.error("No match for template parameter", place, param);
				throw `Failed to render template parameter ${i} around ${s}`;
			}
			return [s];
		}).flat().join("");
		const doc = TemplateParser.parser.parseFromString(stringToParse, this.docType);
		const collection = doc.head.childElementCount ? doc.head.children : doc.body.children;
		const fragment = new DocumentFragment();
		fragment.replaceChildren(...collection);
		const effectors = /* @__PURE__ */ new Map();
		for (const label in postProcess) {
			const site = fragment.querySelector(`[data-${label}]`);
			if (site) postProcess[label].forEach((m) => {
				const effector = m.apply(site, fragment);
				if (effector) {
					let list = effectors.get(label);
					if (list) list.push(effector);
					else effectors.set(label, [effector]);
				}
			});
		}
		return createTemplate(fragment, (...scope) => renderForEffects(fragment, effectors, ...scope));
	}
	static {
		this.OPEN_RE = /<([a-zA-z][$a-zA-Z0-9.-]*)\s+[^>]*$/;
	}
	static {
		this.IN_TAG_RE = /^(\s+|[^<>]*|"[^"]*")*$/;
	}
	static {
		this.ATTR_RE = /([$.]?[a-zA-Z][$a-zA-Z0-9.-]*)=\s*$/;
	}
	static {
		this.CLOSE_RE = /[/]?>[^<]*$/;
	}
	classifyPlace(i, template) {
		let tagOpen = null;
		for (let prev = i; prev >= 0; prev--) {
			if (template[prev].match(TemplateParser.CLOSE_RE)) break;
			tagOpen = template[prev].match(TemplateParser.OPEN_RE);
			if (tagOpen) break;
			if (!template[prev].match(TemplateParser.IN_TAG_RE)) break;
		}
		if (tagOpen) {
			const tagAttr = template[i].match(TemplateParser.ATTR_RE);
			if (tagAttr) return {
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
		return {
			kind: "element content",
			nodeLabel: `node${i}`
		};
	}
	tryReplacements(place, param) {
		const replacements = this.plugins;
		for (let i = 0; i < replacements.length; i++) {
			const sub = replacements[i];
			if (place.kind === sub.place && checkType(param, sub)) return sub.mutator(place, param);
		}
	}
};
function checkType(param, sub) {
	if (typeof sub.types === "function") return sub.types(param, sub);
	return sub.types.includes(typeof param);
}
//#endregion
//#region src/html/mutation.ts
var Mutation = class {
	constructor(place) {
		this.place = place;
	}
	apply(_site, _fragment) {
		throw "abstract method 'apply' called";
	}
};
var ElementContentMutation = class extends Mutation {
	constructor(place, content) {
		super(place);
		this.content = content;
	}
	apply(site, fragment) {
		(site.parentNode || fragment).replaceChild(this.content, site);
	}
};
var AttributeValueMutation = class extends Mutation {
	constructor(place, text) {
		super(place);
		this.text = text;
		this.name = place.attrName;
	}
	apply(site) {
		site.setAttribute(this.name, this.text);
	}
};
var ElementContentEffect = class extends Mutation {
	constructor(place, fn) {
		super(place);
		this.fn = fn;
	}
	apply(_site, _fragment) {
		const key = this.place.nodeLabel;
		return (site, fragment, ...scope) => {
			const start = new Comment(` <<< ${key} `);
			const end = new Comment(` >>> ${key} `);
			const placeholder = new DocumentFragment();
			placeholder.replaceChildren(start, end);
			(site.parentNode || fragment).replaceChild(placeholder, site);
			require_effects.createEffect((...args) => {
				replaceElementContent(this.fn(...args), start, end);
			}, ...scope);
		};
	}
};
function replaceElementContent(value, start, end) {
	const parent = start.parentNode;
	if (!parent) throw new Error("No parent for placeholder");
	const valueToNode = (v) => {
		if (Array.isArray(v)) {
			const frag = new DocumentFragment();
			const nodes = v.map(valueToNode);
			frag.replaceChildren(...nodes);
			return frag;
		} else if (v instanceof Node) return v;
		else return new Text(v?.toString() || "");
	};
	const node = valueToNode(value);
	console.log("📸 Rendered for view:", value, node);
	let p = start.nextSibling;
	while (p && p !== end) {
		const old = p;
		p = p.nextSibling;
		parent.removeChild(old);
	}
	if (node) parent.insertBefore(node, end);
}
var AttributeValueEffect = class extends Mutation {
	constructor(place, fn) {
		super(place);
		this.fn = fn;
		this.name = place.attrName;
	}
	apply(_site, _fragment) {
		return (site, _, ...scope) => require_effects.createEffect((...args) => {
			replaceAttributeValue(this.fn(...args), site, this.name);
		}, ...scope);
	}
};
function replaceAttributeValue(value, site, attrName) {
	const special = attrName.match(/^([.$])(.+)$/);
	if (special) {
		const [_, pre, name] = special;
		switch (pre) {
			case ".":
				site[name] = value;
				break;
			case "$":
				if ("viewModel" in site && site.viewModel instanceof require_effects.Context) site.viewModel.set(name, value);
				break;
		}
	} else switch (typeof value) {
		case "string":
			site.setAttribute(attrName, value);
			break;
		case "undefined":
		case "object":
		case "boolean":
			if (value) site.setAttribute(attrName, attrName);
			else site.removeAttribute(attrName);
			break;
		default: site.setAttribute(attrName, value?.toString());
	}
}
var TagReferenceEffect = class extends Mutation {
	constructor(place, fn) {
		super(place);
		this.fn = fn;
	}
	apply(_site, _fragment) {
		return (site, _, ...scope) => require_effects.createEffect((...args) => {
			const value = this.fn(...args);
			if (typeof value === "function") value(site);
		}, ...scope);
	}
};
//#endregion
//#region src/html/html.ts
var htmlParser = new TemplateParser();
htmlParser.use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (place, value) => new ElementContentMutation(place, new Text(value?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (place, value) => new AttributeValueMutation(place, value?.toString() || "")
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
	return htmlParser.parse(template, params);
}
//#endregion
//#region src/html/events.ts
/**
* Memory leak warning!
* Need to also clean up all the event listeners, probably
* on disconnectCallback();
*/
function listen(element, map) {
	for (const eventType in map) element.addEventListener(eventType, map[eventType]);
}
function delegate(element, selector, map) {
	for (const eventType in map) {
		const listener = function(ev) {
			const target = ev.target;
			if (target && target instanceof HTMLElement && (target.matches(selector) || element.contains(target.closest(selector)))) map[eventType](ev);
		};
		element.addEventListener(eventType, listener);
	}
}
var Events = {
	listen,
	delegate
};
//#endregion
//#region src/html/shadow.ts
function shadow(el, options = { mode: "open" }) {
	const shadowRoot = el.shadowRoot || el.attachShadow(options);
	const chain = {
		template,
		styles,
		replace,
		root: shadowRoot,
		delegate,
		listen
	};
	return chain;
	function template(fragment) {
		const first = fragment.firstElementChild;
		const template = first && first.tagName === "TEMPLATE" ? first : void 0;
		if (template) shadowRoot.appendChild(template.content.cloneNode(true));
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
	function listen(map) {
		Events.listen(shadowRoot, map);
		return chain;
	}
	function delegate(selector, map) {
		Events.delegate(shadowRoot, selector, map);
		return chain;
	}
}
//#endregion
Object.defineProperty(exports, "Events", {
	enumerable: true,
	get: function() {
		return Events;
	}
});
Object.defineProperty(exports, "createTemplate", {
	enumerable: true,
	get: function() {
		return createTemplate;
	}
});
Object.defineProperty(exports, "css", {
	enumerable: true,
	get: function() {
		return css;
	}
});
Object.defineProperty(exports, "define", {
	enumerable: true,
	get: function() {
		return define;
	}
});
Object.defineProperty(exports, "html", {
	enumerable: true,
	get: function() {
		return html;
	}
});
Object.defineProperty(exports, "shadow", {
	enumerable: true,
	get: function() {
		return shadow;
	}
});
