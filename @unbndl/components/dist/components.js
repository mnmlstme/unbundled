//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function r(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof o ? e.open(n) : e)), t.forEach((e) => e instanceof o && e.close());
	} };
	n.execute();
}
var i = class e {
	constructor() {
		this.signals = /* @__PURE__ */ new WeakMap(), this.scheduled = /* @__PURE__ */ new WeakSet();
	}
	static {
		this.scheduler = new e();
	}
	subscribe(e, t, n) {
		let r = this.signals.get(e);
		r || (r = /* @__PURE__ */ new Map(), this.signals.set(e, r));
		let i = r.get(t);
		i || (i = /* @__PURE__ */ new Set(), r.set(t, i)), i.add(n);
	}
	scheduleEffects(e, t) {
		let n = this.signals.get(e);
		if (!n) return;
		let r = n.get(t);
		if (r) for (let e of r) this.scheduled.has(e) || (this.scheduled.add(e), setTimeout(() => {
			this.scheduled.delete(e), e.execute();
		}));
	}
}, a = class {
	constructor() {
		this.running = [], this.eventType = "un-effect:change";
	}
	isRunning() {
		return this.running.length > 0;
	}
	push(e) {
		this.running.push(e);
	}
	pop() {
		this.running.pop();
	}
	current() {
		let e = this.running.length;
		return e ? this.running[e - 1] : void 0;
	}
	subscribe(e, t) {
		let n = this.current();
		n && i.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (i.scheduler.scheduleEffects(t, e), this.host) {
			let r = new n(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(r);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, o = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new a(), this.object = e, this.proxy = s(this.object, this.manager));
	}
	get(e) {
		return this.proxy[e];
	}
	set(e, t) {
		this.proxy[e] = t;
	}
	toObject() {
		return this.object;
	}
	update(e) {
		Object.assign(this.proxy, e);
	}
	apply(e) {
		this.update(e(this.proxy));
	}
	createEffect(e) {
		r(e, this);
	}
	setHost(e, t) {
		this.manager.setHost(e, t);
	}
	open(e) {
		return this.manager.push(e), this.proxy;
	}
	close() {
		this.manager.pop();
	}
};
function s(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && c(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && c(r) && t.runEffects(n, e), a;
		}
	});
}
function c(e) {
	switch (typeof e) {
		case "object":
		case "number":
		case "string":
		case "symbol":
		case "boolean":
		case "undefined": return !0;
		default: return !1;
	}
}
function l(e, ...t) {
	let n = e.map((e, n) => n ? [t[n - 1], e] : [e]).flat().join(""), r = new CSSStyleSheet();
	return r.replaceSync(n), r;
}
function u(e, t) {
	return Object.assign(e, { render: t }), e;
}
function d(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var f = class e {
	static {
		this.parser = new DOMParser();
	}
	constructor(e) {
		this.docType = "text/html", this.plugins = [], e && (this.docType = e);
	}
	use(e) {
		this.plugins = this.plugins.concat(e);
	}
	parse(t, n) {
		let r = {}, i = t.map((e, i) => {
			if (i >= n.length) return [e];
			let a = n[i], o = this.classifyPlace(i, t), s = this.tryReplacements(o, a);
			if (s) {
				let t = r[o.nodeLabel];
				switch (t ? t.push(s) : r[o.nodeLabel] = [s], o.kind) {
					case "attr value": return [e, `"" data-${o.nodeLabel}`];
					case "tag content": return [e, `data-${o.nodeLabel}`];
					case "element content": return [e, `<ins data-${o.nodeLabel}></ins>`];
				}
			} else throw console.error("No match for template parameter", o, a), `Failed to render template parameter ${i} around ${e}`;
			return [e];
		}).flat().join(""), a = e.parser.parseFromString(i, this.docType), o = a.head.childElementCount ? a.head.children : a.body.children, s = new DocumentFragment();
		s.replaceChildren(...o);
		let c = /* @__PURE__ */ new Map();
		for (let e in r) {
			let t = s.querySelector(`[data-${e}]`);
			t && r[e].forEach((n) => {
				let r = n.apply(t, s);
				if (r) {
					let t = c.get(e);
					t ? t.push(r) : c.set(e, [r]);
				}
			});
		}
		return u(s, (...e) => d(s, c, ...e));
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
	classifyPlace(t, n) {
		let r = null;
		for (let i = t; i >= 0 && !(n[i].match(e.CLOSE_RE) || (r = n[i].match(e.OPEN_RE), r) || !n[i].match(e.IN_TAG_RE)); i--);
		if (r) {
			let i = n[t].match(e.ATTR_RE);
			return i ? {
				kind: "attr value",
				nodeLabel: `node${t}`,
				tagName: r[1],
				attrName: i[1]
			} : {
				kind: "tag content",
				nodeLabel: `node${t}`,
				tagName: r[1]
			};
		}
		return {
			kind: "element content",
			nodeLabel: `node${t}`
		};
	}
	tryReplacements(e, t) {
		let n = this.plugins;
		for (let r = 0; r < n.length; r++) {
			let i = n[r];
			if (e.kind === i.place && p(t, i)) return i.mutator(e, t);
		}
	}
};
function p(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var m = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, h = class extends m {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, g = class extends m {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, _ = class extends m {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...i) => {
			let a = new Comment(` <<< ${n} `), o = new Comment(` >>> ${n} `), s = new DocumentFragment();
			s.replaceChildren(a, o), (e.parentNode || t).replaceChild(s, e), r((...e) => {
				v(this.fn(...e), a, o);
			}, ...i);
		};
	}
};
function v(e, t, n) {
	let r = t.parentNode;
	if (!r) throw Error("No parent for placeholder");
	let i = (e) => {
		if (Array.isArray(e)) {
			let t = new DocumentFragment(), n = e.map(i);
			return t.replaceChildren(...n), t;
		} else if (e instanceof Node) return e;
		else return new Text(e?.toString() || "");
	}, a = i(e);
	console.log("📸 Rendered for view:", e, a);
	let o = t.nextSibling;
	for (; o && o !== n;) {
		let e = o;
		o = o.nextSibling, r.removeChild(e);
	}
	a && r.insertBefore(a, n);
}
var y = class extends m {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => r((...t) => {
			b(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function b(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof o && t.viewModel.set(a, e);
				break;
		}
	} else switch (typeof e) {
		case "string":
			t.setAttribute(n, e);
			break;
		case "undefined":
		case "object":
		case "boolean":
			e ? t.setAttribute(n, n) : t.removeAttribute(n);
			break;
		default: t.setAttribute(n, e?.toString());
	}
}
var x = class extends m {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => r((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
}, S = new f();
S.use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new h(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new g(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new h(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new _(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new y(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new x(e, t)
	}
]);
function C(e, ...t) {
	return S.parse(e, t);
}
function w(e, t) {
	for (let n in t) e.addEventListener(n, t[n]);
}
function T(e, t, n) {
	for (let r in n) e.addEventListener(r, function(i) {
		let a = i.target;
		a && a instanceof HTMLElement && (a.matches(t) || e.contains(a.closest(t))) && n[r](i);
	});
}
function E(e, t, n) {
	let r = e.target, i = new CustomEvent(t, {
		bubbles: !0,
		composed: !0,
		detail: n
	});
	r.dispatchEvent(i), e.stopPropagation();
}
var D = {
	listen: w,
	delegate: T,
	relay: E
};
function O(e, t = { mode: "open" }) {
	let n = e.shadowRoot || e.attachShadow(t), r = {
		template: i,
		styles: a,
		replace: o,
		root: n,
		delegate: c,
		listen: s
	};
	return r;
	function i(e) {
		let t = e.firstElementChild, i = t && t.tagName === "TEMPLATE" ? t : void 0;
		return i && n.appendChild(i.content.cloneNode(!0)), r;
	}
	function a(...e) {
		return n.adoptedStyleSheets = e, r;
	}
	function o(e) {
		return n.replaceChildren(e), r;
	}
	function s(e) {
		return D.listen(n, e), r;
	}
	function c(e, t) {
		return D.delegate(n, e, t), r;
	}
}
//#endregion
//#region src/drop-down.ts
var k = /* @__PURE__ */ t({ Element: () => A }), A = class e extends HTMLElement {
	static {
		this.template = C` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;
	}
	static {
		this.styles = l`
    :host {
      position: relative;
    }
    #is-shown {
      display: none;
    }
    #panel {
      display: none;

      position: absolute;
      right: 0;
      margin-top: var(--size-spacing-small);
      width: max-content;
      padding: var(--size-spacing-small);
      border-radius: var(--size-radius-small);
      background: var(--color-background-card);
      color: var(--color-text);
      box-shadow: var(--shadow-popover);
    }
    :host([open]) #panel {
      display: block;
    }
  `;
	}
	constructor() {
		if (super(), O(this).template(e.template).styles(e.styles), this.shadowRoot) {
			let e = this.shadowRoot.querySelector("slot[name='actuator']");
			e && e.addEventListener("click", () => this.toggle());
		}
	}
	toggle() {
		this.hasAttribute("open") ? this.removeAttribute("open") : this.setAttribute("open", "open");
	}
}, j = /* @__PURE__ */ t({});
//#endregion
export { k as Dropdown, j as InputArray };
