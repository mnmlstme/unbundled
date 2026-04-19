//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, a) => (a = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule ? t(a, "default", {
	value: n,
	enumerable: !0
}) : a, n)), u = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), d = Object.defineProperty, ee = /* @__PURE__ */ ((e, t) => {
	let n = {};
	for (var r in e) d(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || d(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	Dispatch: () => p,
	None: () => f,
	dispatch: () => h,
	dispatcher: () => m
}), f = [], p = class extends CustomEvent {
	constructor(e, t = "un:message") {
		super(t, {
			bubbles: !0,
			composed: !0,
			detail: e
		});
	}
};
function m(e = "un:message") {
	return (t, ...n) => t.dispatchEvent(new p(n, e));
}
var h = m(), te = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function g(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof y ? e.open(n) : e)), t.forEach((e) => e instanceof y && e.close());
	} };
	n.execute();
}
var _ = class e {
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
}, v = class {
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
		n && _.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (_.scheduler.scheduleEffects(t, e), this.host) {
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
}, y = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new v(), this.object = e, this.proxy = b(this.object, this.manager));
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
		g(e, this);
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
function b(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && x(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && x(r) && t.runEffects(n, e), a;
		}
	});
}
function x(e) {
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
var S = class {
	constructor(e, ...t) {
		this.effectFn = () => e(...t);
	}
	execute() {
		this.effectFn();
	}
};
function C(e, t) {
	return Object.assign(e, { render: t }), e;
}
function w(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var T = class e {
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
		return C(s, (...e) => w(s, c, ...e));
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
			if (e.kind === i.place && E(t, i)) return i.mutator(e, t);
		}
	}
};
function E(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var D = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, ne = class extends D {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, re = class extends D {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, ie = class extends D {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), g((...e) => {
				ae(this.fn(...e), i, a);
			}, ...r);
		};
	}
};
function ae(e, t, n) {
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
var oe = class extends D {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => g((...t) => {
			se(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function se(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof y && t.viewModel.set(a, e);
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
var ce = class extends D {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => g((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
};
new T().use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new ne(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new re(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new ne(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new ie(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new oe(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new ce(e, t)
	}
]);
var O = class e extends HTMLElement {
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
			let [t, n] = e.detail, r = fe(t);
			r && n(r);
		}), document.addEventListener(e.REGISTRY_EVENT, (e) => {
			let [t, n] = e.detail;
			de(t, n);
		});
	}
	constructor(t, n) {
		super(), this.contextLabel = n, this.context = new y(t), this.context.setHost(this, e.CHANGE_EVENT), this.addEventListener(e.DISCOVERY_EVENT, (e) => {
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
function le(e, t) {
	return new Promise((n, r) => {
		let i = new CustomEvent(O.DISCOVERY_EVENT, {
			bubbles: !0,
			composed: !0,
			detail: [t, (e) => e ? n(e) : r()]
		});
		e.isConnected ? e.dispatchEvent(i) : document.dispatchEvent(i);
	});
}
var ue = {};
function de(e, t) {
	ue[e] = t;
}
function fe(e) {
	return ue[e];
}
var pe = class {
	constructor(e) {
		this.contextLabel = e;
	}
	observe(e, t) {
		return new Promise((n, r) => {
			this.provider ? n(this.attachObserver(t)) : le(e, this.contextLabel).then((e) => {
				this.provider = e, n(this.attachObserver(t));
			}).catch((e) => r(e));
		});
	}
	attachObserver(e) {
		let t = this.provider.attach((t) => {
			let { property: n, value: r } = t.detail, i = new S(e, {
				property: n,
				value: r
			});
			this.observed && (this.observed[n] = r, i.execute());
		});
		return this.observed = t, t;
	}
}, me = class {
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
}, he = class {
	constructor(e, t) {
		this.client = e, this.observer = new pe(t);
	}
	start(e) {
		return this.observer.observe(this.client, (t) => {
			e(t.property, t.value);
		});
	}
}, ge = /* @__PURE__ */ s({
	CONTEXT_DEFAULT: () => k,
	Provider: () => _e,
	Service: () => A,
	dispatch: () => j
}), k = "context:history", A = class e extends me {
	static {
		this.EVENT_TYPE = "history:message";
	}
	constructor(t) {
		super((e, t) => this.update(e, t), t, e.EVENT_TYPE);
	}
	update(e, t) {
		switch (e[0]) {
			case "history/navigate": {
				let { href: n, state: r } = e[1];
				return history.pushState(r, "", n), {
					...t,
					location: document.location,
					state: history.state
				};
			}
			case "history/redirect": {
				let { href: n, state: r } = e[1];
				return history.replaceState(r, "", n), {
					...t,
					location: document.location,
					state: history.state
				};
			}
		}
	}
}, _e = class extends O {
	constructor() {
		super({
			location: document.location,
			state: {}
		}, k), this.addEventListener("click", (e) => {
			let t = ve(e);
			if (t) {
				let n = new URL(t.href), r = this.context.get("location");
				r && n.origin === r.origin && n.pathname.startsWith(this.base || "/") && (e.preventDefault(), j(t, "history/navigate", { href: n.pathname + n.search }));
			}
		}), window.addEventListener("popstate", (e) => {
			this.context.update({
				location: document.location,
				state: e.state
			});
		});
	}
	get base() {
		return this.getAttribute("base") || void 0;
	}
	connectedCallback() {
		new A(this.context).attach(this);
	}
	attributeChangedCallback() {}
};
function ve(e) {
	let t = e.currentTarget, n = (e) => e.tagName == "A" && e.href;
	if (e.button === 0) {
		if (e.composed) return e.composedPath().find(n) || void 0;
		for (let r = e.target; r; r === t || r.parentElement) if (n(r)) return r;
		return;
	}
}
var j = ee.dispatcher(A.EVENT_TYPE), ye = /* @__PURE__ */ o(((e) => {
	var t = (function() {
		var e = function(e, t, n, r) {
			for (n ||= {}, r = e.length; r--; n[e[r]] = t);
			return n;
		}, t = [1, 9], n = [1, 10], r = [1, 11], i = [1, 12], a = [
			5,
			11,
			12,
			13,
			14,
			15
		], o = {
			trace: function() {},
			yy: {},
			symbols_: {
				error: 2,
				root: 3,
				expressions: 4,
				EOF: 5,
				expression: 6,
				optional: 7,
				literal: 8,
				splat: 9,
				param: 10,
				"(": 11,
				")": 12,
				LITERAL: 13,
				SPLAT: 14,
				PARAM: 15,
				$accept: 0,
				$end: 1
			},
			terminals_: {
				2: "error",
				5: "EOF",
				11: "(",
				12: ")",
				13: "LITERAL",
				14: "SPLAT",
				15: "PARAM"
			},
			productions_: [
				0,
				[3, 2],
				[3, 1],
				[4, 2],
				[4, 1],
				[6, 1],
				[6, 1],
				[6, 1],
				[6, 1],
				[7, 3],
				[8, 1],
				[9, 1],
				[10, 1]
			],
			performAction: function(e, t, n, r, i, a, o) {
				var s = a.length - 1;
				switch (i) {
					case 1: return new r.Root({}, [a[s - 1]]);
					case 2: return new r.Root({}, [new r.Literal({ value: "" })]);
					case 3:
						this.$ = new r.Concat({}, [a[s - 1], a[s]]);
						break;
					case 4:
					case 5:
						this.$ = a[s];
						break;
					case 6:
						this.$ = new r.Literal({ value: a[s] });
						break;
					case 7:
						this.$ = new r.Splat({ name: a[s] });
						break;
					case 8:
						this.$ = new r.Param({ name: a[s] });
						break;
					case 9:
						this.$ = new r.Optional({}, [a[s - 1]]);
						break;
					case 10:
						this.$ = e;
						break;
					case 11:
					case 12:
						this.$ = e.slice(1);
						break;
				}
			},
			table: [
				{
					3: 1,
					4: 2,
					5: [1, 3],
					6: 4,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: t,
					13: n,
					14: r,
					15: i
				},
				{ 1: [3] },
				{
					5: [1, 13],
					6: 14,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: t,
					13: n,
					14: r,
					15: i
				},
				{ 1: [2, 2] },
				e(a, [2, 4]),
				e(a, [2, 5]),
				e(a, [2, 6]),
				e(a, [2, 7]),
				e(a, [2, 8]),
				{
					4: 15,
					6: 4,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: t,
					13: n,
					14: r,
					15: i
				},
				e(a, [2, 10]),
				e(a, [2, 11]),
				e(a, [2, 12]),
				{ 1: [2, 1] },
				e(a, [2, 3]),
				{
					6: 14,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: t,
					12: [1, 16],
					13: n,
					14: r,
					15: i
				},
				e(a, [2, 9])
			],
			defaultActions: {
				3: [2, 2],
				13: [2, 1]
			},
			parseError: function(e, t) {
				if (t.recoverable) this.trace(e);
				else {
					function n(e, t) {
						this.message = e, this.hash = t;
					}
					throw n.prototype = Error, new n(e, t);
				}
			},
			parse: function(e) {
				var t = this, n = [0], r = [null], i = [], a = this.table, o = "", s = 0, c = 0, l = 0, u = 2, d = 1, ee = i.slice.call(arguments, 1), f = Object.create(this.lexer), p = { yy: {} };
				for (var m in this.yy) Object.prototype.hasOwnProperty.call(this.yy, m) && (p.yy[m] = this.yy[m]);
				f.setInput(e, p.yy), p.yy.lexer = f, p.yy.parser = this, f.yylloc === void 0 && (f.yylloc = {});
				var h = f.yylloc;
				i.push(h);
				var te = f.options && f.options.ranges;
				typeof p.yy.parseError == "function" ? this.parseError = p.yy.parseError : this.parseError = Object.getPrototypeOf(this).parseError;
				_token_stack: var g = function() {
					var e = f.lex() || d;
					return typeof e != "number" && (e = t.symbols_[e] || e), e;
				};
				for (var _, v, y, b, x, S = {}, C, w, T, E;;) {
					if (y = n[n.length - 1], this.defaultActions[y] ? b = this.defaultActions[y] : (_ ??= g(), b = a[y] && a[y][_]), b === void 0 || !b.length || !b[0]) {
						var D = "";
						for (C in E = [], a[y]) this.terminals_[C] && C > u && E.push("'" + this.terminals_[C] + "'");
						D = f.showPosition ? "Parse error on line " + (s + 1) + ":\n" + f.showPosition() + "\nExpecting " + E.join(", ") + ", got '" + (this.terminals_[_] || _) + "'" : "Parse error on line " + (s + 1) + ": Unexpected " + (_ == d ? "end of input" : "'" + (this.terminals_[_] || _) + "'"), this.parseError(D, {
							text: f.match,
							token: this.terminals_[_] || _,
							line: f.yylineno,
							loc: h,
							expected: E
						});
					}
					if (b[0] instanceof Array && b.length > 1) throw Error("Parse Error: multiple actions possible at state: " + y + ", token: " + _);
					switch (b[0]) {
						case 1:
							n.push(_), r.push(f.yytext), i.push(f.yylloc), n.push(b[1]), _ = null, v ? (_ = v, v = null) : (c = f.yyleng, o = f.yytext, s = f.yylineno, h = f.yylloc, l > 0 && l--);
							break;
						case 2:
							if (w = this.productions_[b[1]][1], S.$ = r[r.length - w], S._$ = {
								first_line: i[i.length - (w || 1)].first_line,
								last_line: i[i.length - 1].last_line,
								first_column: i[i.length - (w || 1)].first_column,
								last_column: i[i.length - 1].last_column
							}, te && (S._$.range = [i[i.length - (w || 1)].range[0], i[i.length - 1].range[1]]), x = this.performAction.apply(S, [
								o,
								c,
								s,
								p.yy,
								b[1],
								r,
								i
							].concat(ee)), x !== void 0) return x;
							w && (n = n.slice(0, -1 * w * 2), r = r.slice(0, -1 * w), i = i.slice(0, -1 * w)), n.push(this.productions_[b[1]][0]), r.push(S.$), i.push(S._$), T = a[n[n.length - 2]][n[n.length - 1]], n.push(T);
							break;
						case 3: return !0;
					}
				}
				return !0;
			}
		};
		o.lexer = (function() {
			return {
				EOF: 1,
				parseError: function(e, t) {
					if (this.yy.parser) this.yy.parser.parseError(e, t);
					else throw Error(e);
				},
				setInput: function(e, t) {
					return this.yy = t || this.yy || {}, this._input = e, this._more = this._backtrack = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
						first_line: 1,
						first_column: 0,
						last_line: 1,
						last_column: 0
					}, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this;
				},
				input: function() {
					var e = this._input[0];
					return this.yytext += e, this.yyleng++, this.offset++, this.match += e, this.matched += e, e.match(/(?:\r\n?|\n).*/g) ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), e;
				},
				unput: function(e) {
					var t = e.length, n = e.split(/(?:\r\n?|\n)/g);
					this._input = e + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - t), this.offset -= t;
					var r = this.match.split(/(?:\r\n?|\n)/g);
					this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), n.length - 1 && (this.yylineno -= n.length - 1);
					var i = this.yylloc.range;
					return this.yylloc = {
						first_line: this.yylloc.first_line,
						last_line: this.yylineno + 1,
						first_column: this.yylloc.first_column,
						last_column: n ? (n.length === r.length ? this.yylloc.first_column : 0) + r[r.length - n.length].length - n[0].length : this.yylloc.first_column - t
					}, this.options.ranges && (this.yylloc.range = [i[0], i[0] + this.yyleng - t]), this.yyleng = this.yytext.length, this;
				},
				more: function() {
					return this._more = !0, this;
				},
				reject: function() {
					if (this.options.backtrack_lexer) this._backtrack = !0;
					else return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
						text: "",
						token: null,
						line: this.yylineno
					});
					return this;
				},
				less: function(e) {
					this.unput(this.match.slice(e));
				},
				pastInput: function() {
					var e = this.matched.substr(0, this.matched.length - this.match.length);
					return (e.length > 20 ? "..." : "") + e.substr(-20).replace(/\n/g, "");
				},
				upcomingInput: function() {
					var e = this.match;
					return e.length < 20 && (e += this._input.substr(0, 20 - e.length)), (e.substr(0, 20) + (e.length > 20 ? "..." : "")).replace(/\n/g, "");
				},
				showPosition: function() {
					var e = this.pastInput(), t = Array(e.length + 1).join("-");
					return e + this.upcomingInput() + "\n" + t + "^";
				},
				test_match: function(e, t) {
					var n, r, i;
					if (this.options.backtrack_lexer && (i = {
						yylineno: this.yylineno,
						yylloc: {
							first_line: this.yylloc.first_line,
							last_line: this.last_line,
							first_column: this.yylloc.first_column,
							last_column: this.yylloc.last_column
						},
						yytext: this.yytext,
						match: this.match,
						matches: this.matches,
						matched: this.matched,
						yyleng: this.yyleng,
						offset: this.offset,
						_more: this._more,
						_input: this._input,
						yy: this.yy,
						conditionStack: this.conditionStack.slice(0),
						done: this.done
					}, this.options.ranges && (i.yylloc.range = this.yylloc.range.slice(0))), r = e[0].match(/(?:\r\n?|\n).*/g), r && (this.yylineno += r.length), this.yylloc = {
						first_line: this.yylloc.last_line,
						last_line: this.yylineno + 1,
						first_column: this.yylloc.last_column,
						last_column: r ? r[r.length - 1].length - r[r.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + e[0].length
					}, this.yytext += e[0], this.match += e[0], this.matches = e, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._backtrack = !1, this._input = this._input.slice(e[0].length), this.matched += e[0], n = this.performAction.call(this, this.yy, this, t, this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), n) return n;
					if (this._backtrack) {
						for (var a in i) this[a] = i[a];
						return !1;
					}
					return !1;
				},
				next: function() {
					if (this.done) return this.EOF;
					this._input || (this.done = !0);
					var e, t, n, r;
					this._more || (this.yytext = "", this.match = "");
					for (var i = this._currentRules(), a = 0; a < i.length; a++) if (n = this._input.match(this.rules[i[a]]), n && (!t || n[0].length > t[0].length)) {
						if (t = n, r = a, this.options.backtrack_lexer) {
							if (e = this.test_match(n, i[a]), e !== !1) return e;
							if (this._backtrack) {
								t = !1;
								continue;
							} else return !1;
						} else if (!this.options.flex) break;
					}
					return t ? (e = this.test_match(t, i[r]), e === !1 ? !1 : e) : this._input === "" ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
						text: "",
						token: null,
						line: this.yylineno
					});
				},
				lex: function() {
					return this.next() || this.lex();
				},
				begin: function(e) {
					this.conditionStack.push(e);
				},
				popState: function() {
					return this.conditionStack.length - 1 > 0 ? this.conditionStack.pop() : this.conditionStack[0];
				},
				_currentRules: function() {
					return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1] ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules : this.conditions.INITIAL.rules;
				},
				topState: function(e) {
					return e = this.conditionStack.length - 1 - Math.abs(e || 0), e >= 0 ? this.conditionStack[e] : "INITIAL";
				},
				pushState: function(e) {
					this.begin(e);
				},
				stateStackSize: function() {
					return this.conditionStack.length;
				},
				options: {},
				performAction: function(e, t, n, r) {
					switch (n) {
						case 0: return "(";
						case 1: return ")";
						case 2: return "SPLAT";
						case 3: return "PARAM";
						case 4: return "LITERAL";
						case 5: return "LITERAL";
						case 6: return "EOF";
					}
				},
				rules: [
					/^(?:\()/,
					/^(?:\))/,
					/^(?:\*+\w+)/,
					/^(?::+\w+)/,
					/^(?:[\w%\-~\n]+)/,
					/^(?:.)/,
					/^(?:$)/
				],
				conditions: { INITIAL: {
					rules: [
						0,
						1,
						2,
						3,
						4,
						5,
						6
					],
					inclusive: !0
				} }
			};
		})();
		function s() {
			this.yy = {};
		}
		return s.prototype = o, o.Parser = s, new s();
	})();
	u !== void 0 && e !== void 0 && (e.parser = t, e.Parser = t.Parser, e.parse = function() {
		return t.parse.apply(t, arguments);
	});
})), M = /* @__PURE__ */ o(((e, t) => {
	function n(e) {
		return function(t, n) {
			return {
				displayName: e,
				props: t,
				children: n || []
			};
		};
	}
	t.exports = {
		Root: n("Root"),
		Concat: n("Concat"),
		Literal: n("Literal"),
		Splat: n("Splat"),
		Param: n("Param"),
		Optional: n("Optional")
	};
})), be = /* @__PURE__ */ o(((e, t) => {
	var n = ye().parser;
	n.yy = M(), t.exports = n;
})), N = /* @__PURE__ */ o(((e, t) => {
	var n = Object.keys(M());
	function r(e) {
		return n.forEach(function(t) {
			if (e[t] === void 0) throw Error("No handler defined for " + t.displayName);
		}), {
			visit: function(e, t) {
				return this.handlers[e.displayName].call(this, e, t);
			},
			handlers: e
		};
	}
	t.exports = r;
})), xe = /* @__PURE__ */ o(((e, t) => {
	var n = N(), r = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	function i(e) {
		this.captures = e.captures, this.re = e.re;
	}
	i.prototype.match = function(e) {
		var t = this.re.exec(e), n = {};
		if (t) return this.captures.forEach(function(e, r) {
			t[r + 1] === void 0 ? n[e] = void 0 : n[e] = decodeURIComponent(t[r + 1]);
		}), n;
	}, t.exports = n({
		Concat: function(e) {
			return e.children.reduce(function(e, t) {
				var n = this.visit(t);
				return {
					re: e.re + n.re,
					captures: e.captures.concat(n.captures)
				};
			}.bind(this), {
				re: "",
				captures: []
			});
		},
		Literal: function(e) {
			return {
				re: e.props.value.replace(r, "\\$&"),
				captures: []
			};
		},
		Splat: function(e) {
			return {
				re: "([^?]*?)",
				captures: [e.props.name]
			};
		},
		Param: function(e) {
			return {
				re: "([^\\/\\?]+)",
				captures: [e.props.name]
			};
		},
		Optional: function(e) {
			var t = this.visit(e.children[0]);
			return {
				re: "(?:" + t.re + ")?",
				captures: t.captures
			};
		},
		Root: function(e) {
			var t = this.visit(e.children[0]);
			return new i({
				re: RegExp("^" + t.re + "(?=\\?|$)"),
				captures: t.captures
			});
		}
	});
})), Se = /* @__PURE__ */ o(((e, t) => {
	t.exports = N()({
		Concat: function(e, t) {
			var n = e.children.map(function(e) {
				return this.visit(e, t);
			}.bind(this));
			return n.some(function(e) {
				return e === !1;
			}) ? !1 : n.join("");
		},
		Literal: function(e) {
			return decodeURI(e.props.value);
		},
		Splat: function(e, t) {
			return t[e.props.name] ? t[e.props.name] : !1;
		},
		Param: function(e, t) {
			return t[e.props.name] ? t[e.props.name] : !1;
		},
		Optional: function(e, t) {
			return this.visit(e.children[0], t) || "";
		},
		Root: function(e, t) {
			t ||= {};
			var n = this.visit(e.children[0], t);
			return n ? encodeURI(n) : !1;
		}
	});
})), Ce = /* @__PURE__ */ o(((e, t) => {
	var n = be(), r = xe(), i = Se();
	a.prototype = Object.create(null), a.prototype.match = function(e) {
		return r.visit(this.ast).match(e) || !1;
	}, a.prototype.reverse = function(e) {
		return i.visit(this.ast, e);
	};
	function a(e) {
		var t = this ? this : Object.create(a.prototype);
		if (e === void 0) throw Error("A route spec is required");
		return t.spec = e, t.ast = n.parse(e), t;
	}
	t.exports = a;
})), we = /* @__PURE__ */ l((/* @__PURE__ */ o(((e, t) => {
	t.exports = Ce();
})))(), 1), Te = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function P(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof F ? e.open(n) : e)), t.forEach((e) => e instanceof F && e.close());
	} };
	n.execute();
}
var Ee = class e {
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
}, De = class {
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
		n && Ee.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (Ee.scheduler.scheduleEffects(t, e), this.host) {
			let n = new Te(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, F = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new De(), this.object = e, this.proxy = Oe(this.object, this.manager));
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
		P(e, this);
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
function Oe(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && ke(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && ke(r) && t.runEffects(n, e), a;
		}
	});
}
function ke(e) {
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
function Ae(e, t) {
	return Object.assign(e, { render: t }), e;
}
function je(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var Me = class e {
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
		return Ae(s, (...e) => je(s, c, ...e));
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
			if (e.kind === i.place && Ne(t, i)) return i.mutator(e, t);
		}
	}
};
function Ne(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var I = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, Pe = class extends I {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, Fe = class extends I {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, Ie = class extends I {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), P((...e) => {
				Le(this.fn(...e), i, a);
			}, ...r);
		};
	}
};
function Le(e, t, n) {
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
var Re = class extends I {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => P((...t) => {
			ze(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function ze(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof F && t.viewModel.set(a, e);
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
var Be = class extends I {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => P((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
}, Ve = new Me();
Ve.use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new Pe(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new Fe(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new Pe(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new Ie(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new Re(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new Be(e, t)
	}
]);
function L(e, ...t) {
	return Ve.parse(e, t);
}
function He(e, t) {
	for (let n in t) e.addEventListener(n, t[n]);
}
function Ue(e, t, n) {
	for (let r in n) e.addEventListener(r, function(i) {
		let a = i.target;
		a && a instanceof HTMLElement && (a.matches(t) || e.contains(a.closest(t))) && n[r](i);
	});
}
var We = {
	listen: He,
	delegate: Ue
};
function Ge(e, t = { mode: "open" }) {
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
		return We.listen(n, e), r;
	}
	function c(e, t) {
		return We.delegate(n, e, t), r;
	}
}
//#endregion
//#region ../view/dist/view.js
var R = class {
	constructor(e, t) {
		this.origin = e;
		let n = Ke(t).map(([e, t]) => [t, e]);
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
function Ke(e) {
	return Object.entries(e).map(([e, t]) => [e, t]);
}
var qe = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function z(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof V ? e.open(n) : e)), t.forEach((e) => e instanceof V && e.close());
	} };
	n.execute();
}
var B = class e {
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
}, Je = class {
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
		n && B.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (B.scheduler.scheduleEffects(t, e), this.host) {
			let n = new qe(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, V = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new Je(), this.object = e, this.proxy = Ye(this.object, this.manager));
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
		z(e, this);
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
function Ye(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && H(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && H(r) && t.runEffects(n, e), a;
		}
	});
}
function H(e) {
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
function Xe(e, t) {
	return Object.assign(e, { render: t }), e;
}
function Ze(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var Qe = class e {
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
		return Xe(s, (...e) => Ze(s, c, ...e));
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
			if (e.kind === i.place && $e(t, i)) return i.mutator(e, t);
		}
	}
};
function $e(e, t) {
	return typeof t.types == "function" ? t.types(e, t) : t.types.includes(typeof e);
}
var U = class {
	constructor(e) {
		this.place = e;
	}
	apply(e, t) {
		throw "abstract method 'apply' called";
	}
}, W = class extends U {
	constructor(e, t) {
		super(e), this.content = t;
	}
	apply(e, t) {
		(e.parentNode || t).replaceChild(this.content, e);
	}
}, et = class extends U {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, tt = class extends U {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), z((...e) => {
				nt(this.fn(...e), i, a);
			}, ...r);
		};
	}
};
function nt(e, t, n) {
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
var rt = class extends U {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => z((...t) => {
			it(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function it(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof V && t.viewModel.set(a, e);
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
var at = class extends U {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => z((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
};
new Qe().use([
	{
		place: "element content",
		types: [
			"string",
			"number",
			"bigint",
			"symbol",
			"boolean"
		],
		mutator: (e, t) => new W(e, new Text(t?.toString() || ""))
	},
	{
		place: "attr value",
		types: [
			"string",
			"number",
			"bigint",
			"symbol"
		],
		mutator: (e, t) => new et(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new W(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new tt(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new rt(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new at(e, t)
	}
]);
var G = class extends V {
	constructor(e, t) {
		super(e, t);
	}
	get $() {
		return this.toObject();
	}
	with(e, ...t) {
		let n = Object.fromEntries(t.map((e) => [e, e]));
		return this.merge(new R(e, n));
	}
	withCalculated(e, t) {
		return this.merge(new R(e, t));
	}
	withRenamed(e, t) {
		return this.merge(new R(e, t));
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
function ot(e) {
	return e === void 0 ? new G({}) : new G(e);
}
//#endregion
//#region ../auth/dist/auth.js
var st = Object.defineProperty, ct = (e, t) => {
	let n = {};
	for (var r in e) st(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || st(n, Symbol.toStringTag, { value: "Module" }), n;
}, K = class extends Error {};
K.prototype.name = "InvalidTokenError";
function lt(e) {
	return decodeURIComponent(atob(e).replace(/(.)/g, (e, t) => {
		let n = t.charCodeAt(0).toString(16).toUpperCase();
		return n.length < 2 && (n = "0" + n), "%" + n;
	}));
}
function ut(e) {
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
		return lt(t);
	} catch {
		return atob(t);
	}
}
function dt(e, t) {
	if (typeof e != "string") throw new K("Invalid token specified: must be a string");
	t ||= {};
	let n = t.header === !0 ? 0 : 1, r = e.split(".")[n];
	if (typeof r != "string") throw new K(`Invalid token specified: missing part #${n + 1}`);
	let i;
	try {
		i = ut(r);
	} catch (e) {
		throw new K(`Invalid token specified: invalid base64 for part #${n + 1} (${e.message})`);
	}
	try {
		return JSON.parse(i);
	} catch (e) {
		throw new K(`Invalid token specified: invalid json for part #${n + 1} (${e.message})`);
	}
}
var ft = Object.defineProperty, pt = /* @__PURE__ */ ((e, t) => {
	let n = {};
	for (var r in e) ft(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || ft(n, Symbol.toStringTag, { value: "Module" }), n;
})({
	Dispatch: () => ht,
	None: () => mt,
	dispatch: () => _t,
	dispatcher: () => gt
}), mt = [], ht = class extends CustomEvent {
	constructor(e, t = "un:message") {
		super(t, {
			bubbles: !0,
			composed: !0,
			detail: e
		});
	}
};
function gt(e = "un:message") {
	return (t, ...n) => t.dispatchEvent(new ht(n, e));
}
var _t = gt(), vt = class extends CustomEvent {
	constructor(e, t) {
		super(e, {
			bubbles: !0,
			cancelable: !0,
			composed: !0,
			detail: t
		});
	}
};
function q(e, ...t) {
	let n = { execute() {
		e(...t.map((e) => e instanceof J ? e.open(n) : e)), t.forEach((e) => e instanceof J && e.close());
	} };
	n.execute();
}
var yt = class e {
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
}, bt = class {
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
		n && yt.scheduler.subscribe(t, e, n);
	}
	runEffects(e, t) {
		if (yt.scheduler.scheduleEffects(t, e), this.host) {
			let n = new vt(this.eventType, {
				property: e,
				value: t[e]
			});
			this.host.dispatchEvent(n);
		}
	}
	setHost(e, t) {
		this.host = e, t && (this.eventType = t);
	}
}, J = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(e, t) {
		t ? (this.manager = t.manager, this.object = t.object, this.proxy = t.proxy, this.update(e)) : (this.manager = new bt(), this.object = e, this.proxy = xt(this.object, this.manager));
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
		q(e, this);
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
function xt(e, t) {
	return new Proxy(e, {
		get: (e, n, r) => {
			let i = Reflect.get(e, n, r);
			return t.isRunning() && St(i) && t.subscribe(n, e), i;
		},
		set: (e, n, r, i) => {
			let a = Reflect.set(e, n, r, i);
			return a && St(r) && t.runEffects(n, e), a;
		}
	});
}
function St(e) {
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
var Ct = class {
	constructor(e, ...t) {
		this.effectFn = () => e(...t);
	}
	execute() {
		this.effectFn();
	}
};
function wt(e, t) {
	return Object.assign(e, { render: t }), e;
}
function Tt(e, t, ...n) {
	let r = e.cloneNode(!0);
	return Array.from(t.entries()).forEach(([e, t]) => {
		let i = r.querySelector(`[data-${e}]`);
		i && t.forEach((e) => e(i, r, ...n));
	}), r;
}
var Et = class e {
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
		return wt(s, (...e) => Tt(s, c, ...e));
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
			if (e.kind === i.place && Dt(t, i)) return i.mutator(e, t);
		}
	}
};
function Dt(e, t) {
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
}, Ot = class extends Y {
	constructor(e, t) {
		super(e), this.text = t, this.name = e.attrName;
	}
	apply(e) {
		e.setAttribute(this.name, this.text);
	}
}, kt = class extends Y {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		let n = this.place.nodeLabel;
		return (e, t, ...r) => {
			let i = new Comment(` <<< ${n} `), a = new Comment(` >>> ${n} `), o = new DocumentFragment();
			o.replaceChildren(i, a), (e.parentNode || t).replaceChild(o, e), q((...e) => {
				At(this.fn(...e), i, a);
			}, ...r);
		};
	}
};
function At(e, t, n) {
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
var jt = class extends Y {
	constructor(e, t) {
		super(e), this.fn = t, this.name = e.attrName;
	}
	apply(e, t) {
		return (e, t, ...n) => q((...t) => {
			Mt(this.fn(...t), e, this.name);
		}, ...n);
	}
};
function Mt(e, t, n) {
	let r = n.match(/^([.$])(.+)$/);
	if (r) {
		let [n, i, a] = r;
		switch (i) {
			case ".":
				t[a] = e;
				break;
			case "$":
				"viewModel" in t && t.viewModel instanceof J && t.viewModel.set(a, e);
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
var Nt = class extends Y {
	constructor(e, t) {
		super(e), this.fn = t;
	}
	apply(e, t) {
		return (e, t, ...n) => q((...t) => {
			let n = this.fn(...t);
			typeof n == "function" && n(e);
		}, ...n);
	}
};
new Et().use([
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
		mutator: (e, t) => new Ot(e, t?.toString() || "")
	},
	{
		place: "element content",
		types: (e) => e instanceof Node,
		mutator: (e, t) => new X(e, t)
	},
	{
		place: "element content",
		types: ["function"],
		mutator: (e, t) => new kt(e, t)
	},
	{
		place: "attr value",
		types: ["function"],
		mutator: (e, t) => new jt(e, t)
	},
	{
		place: "tag content",
		types: ["function"],
		mutator: (e, t) => new Nt(e, t)
	}
]);
var Pt = class e extends HTMLElement {
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
			let [t, n] = e.detail, r = Rt(t);
			r && n(r);
		}), document.addEventListener(e.REGISTRY_EVENT, (e) => {
			let [t, n] = e.detail;
			Lt(t, n);
		});
	}
	constructor(t, n) {
		super(), this.contextLabel = n, this.context = new J(t), this.context.setHost(this, e.CHANGE_EVENT), this.addEventListener(e.DISCOVERY_EVENT, (e) => {
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
function Ft(e, t) {
	return new Promise((n, r) => {
		let i = new CustomEvent(Pt.DISCOVERY_EVENT, {
			bubbles: !0,
			composed: !0,
			detail: [t, (e) => e ? n(e) : r()]
		});
		e.isConnected ? e.dispatchEvent(i) : document.dispatchEvent(i);
	});
}
var It = {};
function Lt(e, t) {
	It[e] = t;
}
function Rt(e) {
	return It[e];
}
var zt = class {
	constructor(e) {
		this.contextLabel = e;
	}
	observe(e, t) {
		return new Promise((n, r) => {
			this.provider ? n(this.attachObserver(t)) : Ft(e, this.contextLabel).then((e) => {
				this.provider = e, n(this.attachObserver(t));
			}).catch((e) => r(e));
		});
	}
	attachObserver(e) {
		let t = this.provider.attach((t) => {
			let { property: n, value: r } = t.detail, i = new Ct(e, {
				property: n,
				value: r
			});
			this.observed && (this.observed[n] = r, i.execute());
		});
		return this.observed = t, t;
	}
}, Bt = class {
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
function Vt(e, t) {
	return new Ht(e, t);
}
var Ht = class {
	constructor(e, t) {
		this.client = e, this.observer = new zt(t);
	}
	start(e) {
		return this.observer.observe(this.client, (t) => {
			e(t.property, t.value);
		});
	}
}, Ut = /* @__PURE__ */ ct({
	AuthenticatedUser: () => $,
	CONTEXT_DEFAULT: () => Z,
	Provider: () => Gt,
	User: () => Q,
	dispatch: () => Kt,
	headers: () => Zt,
	payload: () => Qt
}), Z = "context:auth", Q = class e {
	static {
		this.TOKEN_KEY = "un-auth:token";
	}
	constructor(e) {
		this.authenticated = !1, this.username = e || "anonymous";
	}
	static deauthenticate(t) {
		return t.authenticated = !1, t.username = "anonymous", localStorage.removeItem(e.TOKEN_KEY), t;
	}
}, $ = class e extends Q {
	constructor(e) {
		super();
		let t = dt(e);
		console.log("Token payload", t), this.token = e, this.authenticated = !0, this.username = t.username;
	}
	static authenticate(t) {
		let n = new e(t);
		return localStorage.setItem(Q.TOKEN_KEY, t), n;
	}
	static authenticateFromLocalStorage() {
		let t = localStorage.getItem(Q.TOKEN_KEY);
		return t ? e.authenticate(t) : new Q();
	}
}, Wt = class e extends Bt {
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
				return [Yt(n), qt(r)];
			case "auth/signout": return [Xt(t), qt(this._redirectForLogin)];
			case "auth/redirect":
				Jt(this._redirectForLogin, { next: window.location.href });
				break;
			default:
				let i = e[0];
				throw Error(`Unhandled Auth message "${i}"`);
		}
		return t;
	}
}, Gt = class extends Pt {
	get redirect() {
		return this.getAttribute("redirect") || void 0;
	}
	constructor() {
		let e = $.authenticateFromLocalStorage(), { authenticated: t, username: n } = e;
		super({
			authenticated: t,
			username: n,
			token: t ? e.token : void 0
		}, Z);
	}
	connectedCallback() {
		new Wt(this.context, this.redirect).attach(this);
	}
}, Kt = pt.dispatcher(Wt.EVENT_TYPE);
function qt(e, t = {}) {
	return new Promise((n) => {
		Jt(e, t), n(pt.None);
	});
}
function Jt(e, t = {}) {
	if (e) {
		let n = window.location.href, r = new URL(e, n);
		Object.entries(t).forEach(([e, t]) => r.searchParams.set(e, t)), console.log("Redirecting to ", e), window.location.assign(r);
	}
}
function Yt(e) {
	let { authenticated: t, username: n } = $.authenticate(e);
	return {
		authenticated: t,
		username: n,
		token: e
	};
}
function Xt(e) {
	let { authenticated: t, username: n } = Q.deauthenticate(new Q(e.username));
	return {
		username: n,
		authenticated: t,
		token: void 0
	};
}
function Zt(e) {
	return e.authenticated ? { Authorization: `Bearer ${e.token || "NO_TOKEN"}` } : {};
}
function Qt(e) {
	return e.authenticated ? dt(e.token || "") : {};
}
function $t(e, t = Z) {
	return Vt(e, t);
}
//#endregion
//#region src/fromHistory.ts
function en(e, t = k) {
	return new he(e, t);
}
//#endregion
//#region src/switch.ts
var tn = /* @__PURE__ */ s({
	Element: () => nn,
	Switch: () => nn
}), nn = class extends HTMLElement {
	constructor(e) {
		super(), this.viewModel = ot({ authenticated: !1 }).with($t(this), "authenticated", "username").with(en(this), "location"), this._cases = [], this._routeView = L`
    <h1>Routing...</h1>
  `, this._routeViewModel = ot({
			params: {},
			query: new URLSearchParams()
		}), this._cases = e.map((e) => ({
			...e,
			route: new we.default(e.path)
		})), this.viewModel.createEffect((e) => {
			if (e.location) {
				let t = this.routeToView(e.location, e.authenticated, e.username);
				t !== this._routeView && (this._routeView = t, Ge(this).replace(this._routeViewModel.render(t)));
			}
		});
	}
	routeToView(e, t = !1, n) {
		let r = this.matchRoute(e);
		if (r) {
			if ("view" in r) return r.auth && r.auth !== "public" && !t ? (Ut.dispatch(this, "auth/redirect"), L`
            <h1>Redirecting for Login</h1>
          `) : (this._routeViewModel.update({
				params: r.params,
				query: r.query,
				user: {
					authenticated: t,
					username: n
				}
			}), r.view);
			if ("redirect" in r) {
				let e = r.redirect;
				if (typeof e == "string") return this.redirect(e), L`
            <h1>Redirecting to ${e}…</h1>
          `;
			}
		}
		return L`
      <h1>Not Found</h1>
    `;
	}
	matchRoute(e) {
		let { search: t, pathname: n } = e, r = new URLSearchParams(t), i = n + t;
		for (let e of this._cases) {
			let t = e.route.match(i);
			if (t) return {
				...e,
				path: n,
				params: t,
				query: r
			};
		}
	}
	redirect(e) {
		j(this, "history/redirect", { href: e });
	}
};
//#endregion
export { ge as BrowserHistory, tn as Switch, en as fromHistory };
