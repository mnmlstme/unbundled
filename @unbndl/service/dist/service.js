//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = /* @__PURE__ */ ((t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
})({
	Dispatch: () => r,
	None: () => n,
	dispatch: () => a,
	dispatcher: () => i
}), n = [], r = class extends CustomEvent {
	constructor(e, t = "un:message") {
		super(t, {
			bubbles: !0,
			composed: !0,
			detail: e
		});
	}
};
function i(e = "un:message") {
	return (t, ...n) => t.dispatchEvent(new r(n, e));
}
var a = i(), o = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function s(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof u ? e.open(n) : e)), t.forEach((e) => e instanceof u && e.close());
	} };
	n.execute();
}
var c = class e {
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
}, l = class {
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
		n && c.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (c.scheduler.scheduleEffects(t, e), this.host) {
			let n = new o(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, u = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new l(), this.object = e, this.proxy = d(this.object, this.manager));
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
		s(e, this);
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
function d(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && f(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && f(r) && t.runEffects(n, e), a;
		}
	});
}
function f(e) {
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
var p = class {
	constructor(e, ...t) {
		this.effectFn = () => e(...t);
	}
	execute() {
		this.effectFn();
	}
};
function m(e, t) {
	return Object.assign(e, { render: t }), e;
}
function h(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var g = class e {
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
		return m(s, (...e) => h(s, c, ...e));
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
			if (e.kind === i.place && _(t, i)) return i.mutator(e, t);
		}
	}
};
function _(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var v = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, y = class extends v {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, b = class extends v {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, x = class extends v {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), s((...e) => {
				S(this.fn(...e), i, a);
			}, ...r);
		};
	}
};
function S(e, t, n) {
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
var C = class extends v {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => s((...t) => {
			w(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function w(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof u && t.viewModel.set(a, e);
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
var T = class extends v {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => s((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
};
new g().use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new y(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new b(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new y(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new x(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new C(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new T(e, t)
	}
]);
//#endregion
//#region src/provider.ts
var E = class e extends HTMLElement {
	static {
		this.DISCOVERY_EVENT = "un-provider:discover";
	}
	static {
		this.REGISTRY_EVENT = "un-provider:register";
	}
	static {
		this.CHANGE_EVENT = "un-provider:change";
	}
	static {
		document.addEventListener(e.DISCOVERY_EVENT, (e) => {
			let [t, n] = e.detail, r = A(t);
			r && n(r);
		}), document.addEventListener(e.REGISTRY_EVENT, (e) => {
			let [t, n] = e.detail;
			k(t, n);
		});
	}
	constructor(t, n) {
		super(), this.contextLabel = n, this.context = new u(t), this.context.setHost(this, e.CHANGE_EVENT), this.addEventListener(e.DISCOVERY_EVENT, (e) => {
			let [t, n] = e.detail;
			t === this.contextLabel && (e.stopPropagation(), n(this));
		});
		let r = new CustomEvent(e.REGISTRY_EVENT, {
			bubbles: !0,
			composed: !0,
			detail: [this.contextLabel, this]
		});
		this.dispatchEvent(r);
	}
	attach(t) {
		return this.addEventListener(e.CHANGE_EVENT, t), this.context.toObject();
	}
	detach(t) {
		this.removeEventListener(e.CHANGE_EVENT, t);
	}
};
function D(e, t) {
	return new Promise((n, r) => {
		let i = new CustomEvent(E.DISCOVERY_EVENT, {
			bubbles: !0,
			composed: !0,
			detail: [t, (e) => e ? n(e) : r()]
		});
		e.isConnected ? e.dispatchEvent(i) : document.dispatchEvent(i);
	});
}
var O = {};
function k(e, t) {
	O[e] = t;
}
function A(e) {
	return O[e];
}
//#endregion
//#region src/observer.ts
var j = class {
	constructor(e) {
		this.contextLabel = e;
	}
	observe(e, t) {
		return new Promise((n, r) => {
			this.provider ? n(this.attachObserver(t)) : D(e, this.contextLabel).then((e) => {
				this.provider = e, n(this.attachObserver(t));
			}).catch((e) => r(e));
		});
	}
	attachObserver(e) {
		let t = this.provider.attach((t) => {
			let { property: n, value: r } = t.detail, i = new p(e, {
				property: n,
				value: r
			});
			this.observed && (this.observed[n] = r, i.execute());
		});
		return this.observed = t, t;
	}
}, M = class {
	constructor(e, t, n = "service:message", r = !0) {
		this._pending = [], this._context = t, this._update = e, this._eventType = n, this._running = r;
	}
	attach(e) {
		e.addEventListener(this._eventType, (e) => {
			e.stopPropagation();
			let t = e.detail;
			this.consume(t);
		});
	}
	start() {
		this._running || (this._running = !0, this._pending.forEach((e) => this.process(e)));
	}
	consume(e) {
		if (e.length === 0) {
			let t = e;
			this._running ? this.process(t) : this._pending.push(t);
		}
	}
	process(e) {
		let t = this._update(e, this._context.toObject());
		if (!Array.isArray(t)) return t;
		let [n, ...r] = t;
		return r.forEach((e) => e.then((e) => this.consume(e))), n;
	}
};
//#endregion
//#region src/fromService.ts
function N(e, t) {
	return new P(e, t);
}
var P = class {
	constructor(e, t) {
		this.client = e, this.observer = new j(t);
	}
	start(e) {
		return this.observer.observe(this.client, (t) => {
			e(t.property, t.value);
		});
	}
};
//#endregion
export { P as FromService, t as Message, j as Observer, E as Provider, M as Service, D as discover, N as fromService };
