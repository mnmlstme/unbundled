//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, n = class extends Error {};
n.prototype.name = "InvalidTokenError";
function r(e) {
	return decodeURIComponent(atob(e).replace(/(.)/g, (e, t) => {
		let n = t.charCodeAt(0).toString(16).toUpperCase();
		return n.length < 2 && (n = "0" + n), "%" + n;
	}));
}
function i(e) {
	let t = e.replace(/-/g, "+").replace(/_/g, "/");
	switch (t.length % 4) {
		case 0: break;
		case 2:
			t += "==";
			break;
		case 3:
			t += "=";
			break;
		default: throw Error("base64 string is not of the correct length");
	}
	try {
		return r(t);
	} catch {
		return atob(t);
	}
}
function a(e, t) {
	if (typeof e != "string") throw new n("Invalid token specified: must be a string");
	t ||= {};
	let r = t.header === !0 ? 0 : 1, a = e.split(".")[r];
	if (typeof a != "string") throw new n(`Invalid token specified: missing part #${r + 1}`);
	let o;
	try {
		o = i(a);
	} catch (e) {
		throw new n(`Invalid token specified: invalid base64 for part #${r + 1} (${e.message})`);
	}
	try {
		return JSON.parse(o);
	} catch (e) {
		throw new n(`Invalid token specified: invalid json for part #${r + 1} (${e.message})`);
	}
}
var o = Object.defineProperty, s = /* @__PURE__ */ ((e, t) => {
	let n = {};
	for (var r in e) o(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || o(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	Dispatch: () => l,
	None: () => c,
	dispatch: () => ee,
	dispatcher: () => u
}), c = [], l = class extends CustomEvent {
	constructor(e, t = "un:message") {
		super(t, {
			bubbles: !0,
			composed: !0,
			detail: e
		});
	}
};
function u(e = "un:message") {
	return (t, ...n) => t.dispatchEvent(new l(n, e));
}
var ee = u(), te = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function d(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof p ? e.open(n) : e)), t.forEach((e) => e instanceof p && e.close());
	} };
	n.execute();
}
var f = class e {
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
}, ne = class {
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
		n && f.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (f.scheduler.scheduleEffects(t, e), this.host) {
			let n = new te(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, p = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new ne(), this.object = e, this.proxy = re(this.object, this.manager));
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
		d(e, this);
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
function re(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && m(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && m(r) && t.runEffects(n, e), a;
		}
	});
}
function m(e) {
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
var ie = class {
	constructor(e, ...t) {
		this.effectFn = () => e(...t);
	}
	execute() {
		this.effectFn();
	}
};
function ae(e, t) {
	return Object.assign(e, { render: t }), e;
}
function oe(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var se = class e {
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
		return ae(s, (...e) => oe(s, c, ...e));
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
			if (e.kind === i.place && ce(t, i)) return i.mutator(e, t);
		}
	}
};
function ce(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var h = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, g = class extends h {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, le = class extends h {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, _ = class extends h {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), d((...e) => {
				v(this.fn(...e), i, a);
			}, ...r);
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
var y = class extends h {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => d((...t) => {
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
				"viewModel" in t && t.viewModel instanceof p && t.viewModel.set(a, e);
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
var x = class extends h {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => d((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
};
new se().use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new g(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new le(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new g(e, t)
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
var ue = class e extends HTMLElement {
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
			let [t, n] = e.detail, r = pe(t);
			r && n(r);
		}), document.addEventListener(e.REGISTRY_EVENT, (e) => {
			let [t, n] = e.detail;
			fe(t, n);
		});
	}
	constructor(t, n) {
		super(), this.contextLabel = n, this.context = new p(t), this.context.setHost(this, e.CHANGE_EVENT), this.addEventListener(e.DISCOVERY_EVENT, (e) => {
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
function de(e, t) {
	return new Promise((n, r) => {
		let i = new CustomEvent(ue.DISCOVERY_EVENT, {
			bubbles: !0,
			composed: !0,
			detail: [t, (e) => e ? n(e) : r()]
		});
		e.isConnected ? e.dispatchEvent(i) : document.dispatchEvent(i);
	});
}
var S = {};
function fe(e, t) {
	S[e] = t;
}
function pe(e) {
	return S[e];
}
var me = class {
	constructor(e) {
		this.contextLabel = e;
	}
	observe(e, t) {
		return new Promise((n, r) => {
			this.provider ? n(this.attachObserver(t)) : de(e, this.contextLabel).then((e) => {
				this.provider = e, n(this.attachObserver(t));
			}).catch((e) => r(e));
		});
	}
	attachObserver(e) {
		let t = this.provider.attach((t) => {
			let { property: n, value: r } = t.detail, i = new ie(e, {
				property: n,
				value: r
			});
			this.observed && (this.observed[n] = r, i.execute());
		});
		return this.observed = t, t;
	}
}, he = class {
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
function ge(e, t) {
	return new _e(e, t);
}
var _e = class {
	constructor(e, t) {
		this.client = e, this.observer = new me(t);
	}
	start(e) {
		return this.observer.observe(this.client, (t) => {
			e(t.property, t.value);
		});
	}
}, ve = "context:auth", C = class e {
	static {
		this.TOKEN_KEY = "un-auth:token";
	}
	constructor(e) {
		this.authenticated = !1, this.username = e || "anonymous";
	}
	static deauthenticate(t) {
		return t.authenticated = !1, t.username = "anonymous", localStorage.removeItem(e.TOKEN_KEY), t;
	}
}, ye = class e extends C {
	constructor(e) {
		super();
		let t = a(e);
		console.log("Token payload", t), this.token = e, this.authenticated = !0, this.username = t.username;
	}
	static authenticate(t) {
		let n = new e(t);
		return localStorage.setItem(C.TOKEN_KEY, t), n;
	}
	static authenticateFromLocalStorage() {
		let t = localStorage.getItem(C.TOKEN_KEY);
		return t ? e.authenticate(t) : new C();
	}
}, w = class e extends he {
	static {
		this.EVENT_TYPE = "auth:message";
	}
	constructor(t, n) {
		super((e, t) => this.update(e, t), t, e.EVENT_TYPE), this._redirectForLogin = n;
	}
	update(e, t) {
		switch (e[0]) {
			case "auth/signin":
				let { token: n, redirect: r } = e[1];
				return [D(n), T(r)];
			case "auth/signout": return [O(t), T(this._redirectForLogin)];
			case "auth/redirect":
				E(this._redirectForLogin, { next: window.location.href });
				break;
			default:
				let i = e[0];
				throw Error(`Unhandled Auth message "${i}"`);
		}
		return t;
	}
};
s.dispatcher(w.EVENT_TYPE);
function T(e, t = {}) {
	return new Promise((n) => {
		E(e, t), n(s.None);
	});
}
function E(e, t = {}) {
	if (e) {
		let n = window.location.href, r = new URL(e, n);
		Object.entries(t).forEach(([e, t]) => r.searchParams.set(e, t)), console.log("Redirecting to ", e), window.location.assign(r);
	}
}
function D(e) {
	let { authenticated: t, username: n } = ye.authenticate(e);
	return {
		authenticated: t,
		username: n,
		token: e
	};
}
function O(e) {
	let { authenticated: t, username: n } = C.deauthenticate(new C(e.username));
	return {
		username: n,
		authenticated: t,
		token: void 0
	};
}
function k(e, t = ve) {
	return ge(e, t);
}
//#endregion
//#region ../service/dist/service.js
var A = Object.defineProperty, j = /* @__PURE__ */ ((e, t) => {
	let n = {};
	for (var r in e) A(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || A(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	Dispatch: () => N,
	None: () => M,
	dispatch: () => be,
	dispatcher: () => P
}), M = [], N = class extends CustomEvent {
	constructor(e, t = "un:message") {
		super(t, {
			bubbles: !0,
			composed: !0,
			detail: e
		});
	}
};
function P(e = "un:message") {
	return (t, ...n) => t.dispatchEvent(new N(n, e));
}
var be = P(), xe = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function F(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof L ? e.open(n) : e)), t.forEach((e) => e instanceof L && e.close());
	} };
	n.execute();
}
var I = class e {
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
}, Se = class {
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
		n && I.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (I.scheduler.scheduleEffects(t, e), this.host) {
			let n = new xe(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, L = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new Se(), this.object = e, this.proxy = Ce(this.object, this.manager));
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
		F(e, this);
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
function Ce(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && R(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && R(r) && t.runEffects(n, e), a;
		}
	});
}
function R(e) {
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
var we = class {
	constructor(e, ...t) {
		this.effectFn = () => e(...t);
	}
	execute() {
		this.effectFn();
	}
};
function Te(e, t) {
	return Object.assign(e, { render: t }), e;
}
function Ee(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var De = class e {
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
		return Te(s, (...e) => Ee(s, c, ...e));
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
			if (e.kind === i.place && Oe(t, i)) return i.mutator(e, t);
		}
	}
};
function Oe(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var z = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, B = class extends z {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, ke = class extends z {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, V = class extends z {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), F((...e) => {
				Ae(this.fn(...e), i, a);
			}, ...r);
		};
	}
};
function Ae(e, t, n) {
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
var je = class extends z {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => F((...t) => {
			Me(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function Me(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof L && t.viewModel.set(a, e);
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
var Ne = class extends z {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => F((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
};
new De().use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new B(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new ke(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new B(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new V(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new je(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new Ne(e, t)
	}
]);
var H = class e extends HTMLElement {
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
			let [t, n] = e.detail, r = Ie(t);
			r && n(r);
		}), document.addEventListener(e.REGISTRY_EVENT, (e) => {
			let [t, n] = e.detail;
			Fe(t, n);
		});
	}
	constructor(t, n) {
		super(), this.contextLabel = n, this.context = new L(t), this.context.setHost(this, e.CHANGE_EVENT), this.addEventListener(e.DISCOVERY_EVENT, (e) => {
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
function Pe(e, t) {
	return new Promise((n, r) => {
		let i = new CustomEvent(H.DISCOVERY_EVENT, {
			bubbles: !0,
			composed: !0,
			detail: [t, (e) => e ? n(e) : r()]
		});
		e.isConnected ? e.dispatchEvent(i) : document.dispatchEvent(i);
	});
}
var U = {};
function Fe(e, t) {
	U[e] = t;
}
function Ie(e) {
	return U[e];
}
var Le = class {
	constructor(e) {
		this.contextLabel = e;
	}
	observe(e, t) {
		return new Promise((n, r) => {
			this.provider ? n(this.attachObserver(t)) : Pe(e, this.contextLabel).then((e) => {
				this.provider = e, n(this.attachObserver(t));
			}).catch((e) => r(e));
		});
	}
	attachObserver(e) {
		let t = this.provider.attach((t) => {
			let { property: n, value: r } = t.detail, i = new we(e, {
				property: n,
				value: r
			});
			this.observed && (this.observed[n] = r, i.execute());
		});
		return this.observed = t, t;
	}
}, Re = class {
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
}, ze = class {
	constructor(e, t) {
		this.client = e, this.observer = new Le(t);
	}
	start(e) {
		return this.observer.observe(this.client, (t) => {
			e(t.property, t.value);
		});
	}
}, W = class {
	constructor(e, t) {
		this.origin = e;
		let n = Be(t).map(([e, t]) => [t, e]);
		this.inverse = Object.fromEntries(n);
	}
	mapObservation(e) {
		let t = Object.entries(e);
		return Object.fromEntries(t.map(([e, t]) => [this.inverse[e], t]).filter((e) => e.length > 0));
	}
	start(e) {
		return this.origin.start((t, n) => {
			let r = this.inverse[t];
			e(r, n);
		}).then((e) => this.mapObservation(e));
	}
};
function Be(e) {
	return Object.entries(e).map(([e, t]) => [e, t]);
}
var Ve = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function G(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof q ? e.open(n) : e)), t.forEach((e) => e instanceof q && e.close());
	} };
	n.execute();
}
var K = class e {
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
}, He = class {
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
		n && K.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (K.scheduler.scheduleEffects(t, e), this.host) {
			let n = new Ve(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, q = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new He(), this.object = e, this.proxy = Ue(this.object, this.manager));
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
		G(e, this);
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
function Ue(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && J(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && J(r) && t.runEffects(n, e), a;
		}
	});
}
function J(e) {
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
function We(e, t) {
	return Object.assign(e, { render: t }), e;
}
function Ge(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var Ke = class e {
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
		return We(s, (...e) => Ge(s, c, ...e));
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
			if (e.kind === i.place && qe(t, i)) return i.mutator(e, t);
		}
	}
};
function qe(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var Y = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, X = class extends Y {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, Je = class extends Y {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, Ye = class extends Y {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), G((...e) => {
				Xe(this.fn(...e), i, a);
			}, ...r);
		};
	}
};
function Xe(e, t, n) {
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
var Ze = class extends Y {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => G((...t) => {
			Qe(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function Qe(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof q && t.viewModel.set(a, e);
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
var $e = class extends Y {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => G((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
};
new Ke().use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new X(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new Je(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new X(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new Ye(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new Ze(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new $e(e, t)
	}
]);
var Z = class extends q {
	constructor(e, t) {
		super(e, t);
	}
	get $() {
		return this.toObject();
	}
	with(e, ...t) {
		let n = Object.fromEntries(t.map((e) => [e, e]));
		return this.merge(new W(e, n));
	}
	withCalculated(e, t) {
		return this.merge(new W(e, t));
	}
	withRenamed(e, t) {
		return this.merge(new W(e, t));
	}
	merge(e) {
		if (e) {
			let t = e.start((e, n) => {
				console.log("🪄 Merging effect", e, n, t), this.set(e, n);
			}).then((e) => {
				console.log("👀 ViewModel source observed:", e, t), Object.keys(e).forEach((t) => this.set(t, e[t]));
			});
		}
		return this;
	}
	render(e) {
		return e.render(this);
	}
};
function et(e) {
	return e === void 0 ? new Z({}) : new Z(e);
}
//#endregion
//#region src/store.ts
var tt = /* @__PURE__ */ t({
	CONTEXT_DEFAULT: () => Q,
	Provider: () => nt,
	Service: () => $,
	dispatch: () => rt
}), Q = "context:store", $ = class e extends Re {
	static {
		this.EVENT_TYPE = "store:message";
	}
	constructor(t, n) {
		super((e, t) => n(t, e), t, e.EVENT_TYPE);
	}
}, nt = class extends H {
	constructor(e, t) {
		super(t, Q), this.viewModel = et({ authenticated: !1 }).with(k(this), "authenticated", "username", "token"), this._updateFn = e;
	}
	connectedCallback() {
		new $(this.context, (e, t) => this._updateFn(e, t, this.viewModel.toObject())).attach(this);
	}
};
function rt(e, t) {
	console.log("📨 Dispatching message:", t, e), e.dispatchEvent(new j.Dispatch(t, $.EVENT_TYPE));
}
//#endregion
//#region src/fromStore.ts
function it(e, t = Q) {
	return new ze(e, t);
}
//#endregion
export { tt as Store, it as fromStore };
