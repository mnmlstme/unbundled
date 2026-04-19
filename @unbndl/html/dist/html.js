//#region src/effects/signal.ts
var e = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
//#endregion
//#region src/effects/scheduler.ts
function t(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof i ? e.open(n) : e)), t.forEach((e) => e instanceof i && e.close());
	} };
	n.execute();
}
var n = class e {
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
}, r = class {
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
		let r = this.current();
		r && n.scheduler.subscribe(t, e, r);
	}
	runEffects(t, r) {
		if (n.scheduler.scheduleEffects(r, t), this.host) {
			let n = new e(this.eventType, {
				property: t,
				value: r[t]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, i = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new r(), this.object = e, this.proxy = a(this.object, this.manager));
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
		t(e, this);
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
function a(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && o(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && o(r) && t.runEffects(n, e), a;
		}
	});
}
function o(e) {
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
//#endregion
//#region src/effects/effect.ts
var s = class {
	constructor(e, ...t) {
		this.effectFn = () => e(...t);
	}
	execute() {
		this.effectFn();
	}
};
//#endregion
//#region src/effects/scope.ts
function c(e) {
	return e.map((e) => e instanceof i ? e.toObject() : e);
}
function l(e) {
	return e.map((e) => e === void 0 ? null : new i(e));
}
//#endregion
//#region src/html/css.ts
function u(e, ...t) {
	let n = e.map((e, n) => n ? [t[n - 1], e] : [e]).flat().join(""), r = new CSSStyleSheet();
	return r.replaceSync(n), r;
}
//#endregion
//#region src/html/define.ts
function d(e) {
	return Object.entries(e).map(([e, t]) => {
		customElements.get(e) || customElements.define(e, t);
	}), customElements;
}
//#endregion
//#region src/html/template.ts
function f(e, t) {
	return Object.assign(e, { render: t }), e;
}
//#endregion
//#region src/html/render.ts
function p(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
//#endregion
//#region src/html/parser.ts
var m = class e {
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
		return f(s, (...e) => p(s, c, ...e));
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
			if (e.kind === i.place && h(t, i)) return i.mutator(e, t);
		}
	}
};
function h(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
//#endregion
//#region src/html/mutation.ts
var g = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, _ = class extends g {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, v = class extends g {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, y = class extends g {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, n) {
		let r = this.place.nodeLabel;
		return (e, n, ...i) => {
			let a = new Comment(` <<< ${r} `), o = new Comment(` >>> ${r} `), s = new DocumentFragment();
			s.replaceChildren(a, o), (e.parentNode || n).replaceChild(s, e), t((...e) => {
				b(this.fn(...e), a, o);
			}, ...i);
		};
	}
};
function b(e, t, n) {
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
var x = class extends g {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, n) {
		return (e, n, ...r) => t((...t) => {
			S(this.fn(...t), e, this.name);
		}, ...r);
	}
};
function S(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, a, o] = r;
		switch (a) {
			case ".":
				t[o] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof i && t.viewModel.set(o, e);
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
var C = class extends g {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, n) {
		return (e, n, ...r) => t((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...r);
	}
}, w = new m();
w.use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new _(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new v(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new _(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new y(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new x(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new C(e, t)
	}
]);
function T(e, ...t) {
	return w.parse(e, t);
}
//#endregion
//#region src/html/events.ts
function E(e, t) {
	for (let n in t) e.addEventListener(n, t[n]);
}
function D(e, t, n) {
	for (let r in n) e.addEventListener(r, function(i) {
		let a = i.target;
		a && a instanceof HTMLElement && (a.matches(t) || e.contains(a.closest(t))) && n[r](i);
	});
}
var O = {
	listen: E,
	delegate: D
};
//#endregion
//#region src/html/shadow.ts
function k(e, t = { mode: "open" }) {
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
		return O.listen(n, e), r;
	}
	function c(e, t) {
		return O.delegate(n, e, t), r;
	}
}
//#endregion
export { i as Context, s as DirectEffect, r as EffectsManager, O as Events, n as Scheduler, e as SignalEvent, a as createContext, t as createEffect, l as createScope, f as createTemplate, u as css, d as define, c as exposeTuple, T as html, k as shadow };
