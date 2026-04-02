import { i as Context, r as DirectEffect } from "./effects-Qxlhpdz3.js";
import "./view.js";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region src/service/message.ts
var message_exports = /* @__PURE__ */ __exportAll({
	Dispatch: () => Dispatch,
	None: () => None,
	dispatch: () => dispatch$1,
	dispatcher: () => dispatcher
});
var None = [];
var Dispatch = class extends CustomEvent {
	constructor(msg, eventType = "un:message") {
		super(eventType, {
			bubbles: true,
			composed: true,
			detail: msg
		});
	}
};
function dispatcher(eventType = "un:message") {
	return (target, ...msg) => target.dispatchEvent(new Dispatch(msg, eventType));
}
var dispatch$1 = dispatcher();
//#endregion
//#region src/service/provider.ts
var Provider = class Provider extends HTMLElement {
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
		document.addEventListener(Provider.DISCOVERY_EVENT, (event) => {
			const [contextLabel, respondFn] = event.detail;
			const provider = registeredProvider(contextLabel);
			if (provider) respondFn(provider);
		});
		document.addEventListener(Provider.REGISTRY_EVENT, (event) => {
			const [contextLabel, provider] = event.detail;
			registerProvider(contextLabel, provider);
		});
	}
	constructor(init, label) {
		super();
		this.contextLabel = label;
		this.context = new Context(init);
		this.context.setHost(this, Provider.CHANGE_EVENT);
		this.addEventListener(Provider.DISCOVERY_EVENT, (event) => {
			const [contextLabel, respondFn] = event.detail;
			if (contextLabel === this.contextLabel) {
				event.stopPropagation();
				respondFn(this);
			}
		});
		const registryEvent = new CustomEvent(Provider.REGISTRY_EVENT, {
			bubbles: true,
			composed: true,
			detail: [this.contextLabel, this]
		});
		this.dispatchEvent(registryEvent);
	}
	attach(observer) {
		this.addEventListener(Provider.CHANGE_EVENT, observer);
		return this.context.toObject();
	}
	detach(observer) {
		this.removeEventListener(Provider.CHANGE_EVENT, observer);
	}
};
function discover(observer, contextLabel) {
	return new Promise((resolve, reject) => {
		const discoveryEvent = new CustomEvent(Provider.DISCOVERY_EVENT, {
			bubbles: true,
			composed: true,
			detail: [contextLabel, (provider) => provider ? resolve(provider) : reject()]
		});
		if (observer.isConnected) observer.dispatchEvent(discoveryEvent);
		else document.dispatchEvent(discoveryEvent);
	});
}
var registry = {};
function registerProvider(label, provider) {
	registry[label] = provider;
}
function registeredProvider(label) {
	return registry[label];
}
//#endregion
//#region src/service/observer.ts
var Observer = class {
	constructor(contextLabel) {
		this.contextLabel = contextLabel;
	}
	observe(from, fn) {
		return new Promise((resolve, reject) => {
			if (this.provider) resolve(this.attachObserver(fn));
			else discover(from, this.contextLabel).then((provider) => {
				this.provider = provider;
				resolve(this.attachObserver(fn));
			}).catch((err) => reject(err));
		});
	}
	attachObserver(fn) {
		const init = this.provider.attach((ev) => {
			const { property, value } = ev.detail;
			const effect = new DirectEffect(fn, {
				property,
				value
			});
			if (this.observed) {
				this.observed[property] = value;
				effect.execute();
			}
		});
		this.observed = init;
		return init;
	}
};
//#endregion
//#region src/service/service.ts
var Service = class {
	constructor(update, context, eventType = "service:message", autostart = true) {
		this._pending = [];
		this._context = context;
		this._update = update;
		this._eventType = eventType;
		this._running = autostart;
	}
	attach(host) {
		host.addEventListener(this._eventType, (ev) => {
			ev.stopPropagation();
			const message = ev.detail;
			this.consume(message);
		});
	}
	start() {
		if (!this._running) {
			this._running = true;
			this._pending.forEach((msg) => this.process(msg));
		}
	}
	consume(message) {
		if (message.length === 0) {
			const trueMsg = message;
			if (this._running) this.process(trueMsg);
			else this._pending.push(trueMsg);
		}
	}
	process(message) {
		const next = this._update(message, this._context.toObject());
		if (!Array.isArray(next)) return next;
		const [now, ...later] = next;
		later.forEach((promise) => promise.then((command) => this.consume(command)));
		return now;
	}
};
//#endregion
//#region src/service/fromService.ts
function fromService(target, contextLabel) {
	return new FromService(target, contextLabel);
}
var FromService = class {
	constructor(client, contextLabel) {
		this.client = client;
		this.observer = new Observer(contextLabel);
	}
	start(fn) {
		return this.observer.observe(this.client, (s) => {
			fn(s.property, s.value);
		});
	}
};
//#endregion
//#region ../../node_modules/jwt-decode/build/esm/index.js
var InvalidTokenError = class extends Error {};
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
	return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
		let code = p.charCodeAt(0).toString(16).toUpperCase();
		if (code.length < 2) code = "0" + code;
		return "%" + code;
	}));
}
function base64UrlDecode(str) {
	let output = str.replace(/-/g, "+").replace(/_/g, "/");
	switch (output.length % 4) {
		case 0: break;
		case 2:
			output += "==";
			break;
		case 3:
			output += "=";
			break;
		default: throw new Error("base64 string is not of the correct length");
	}
	try {
		return b64DecodeUnicode(output);
	} catch (err) {
		return atob(output);
	}
}
function jwtDecode(token, options) {
	if (typeof token !== "string") throw new InvalidTokenError("Invalid token specified: must be a string");
	options || (options = {});
	const pos = options.header === true ? 0 : 1;
	const part = token.split(".")[pos];
	if (typeof part !== "string") throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
	let decoded;
	try {
		decoded = base64UrlDecode(part);
	} catch (e) {
		throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
	}
	try {
		return JSON.parse(decoded);
	} catch (e) {
		throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
	}
}
//#endregion
//#region src/auth/auth.ts
var auth_exports = /* @__PURE__ */ __exportAll({
	AuthenticatedUser: () => AuthenticatedUser,
	CONTEXT_DEFAULT: () => AUTH_CONTEXT_DEFAULT,
	Provider: () => AuthProvider,
	User: () => APIUser,
	dispatch: () => dispatch,
	headers: () => authHeaders,
	payload: () => tokenPayload
});
var AUTH_CONTEXT_DEFAULT = "context:auth";
var APIUser = class APIUser {
	static {
		this.TOKEN_KEY = "un-auth:token";
	}
	constructor(username) {
		this.authenticated = false;
		this.username = username || "anonymous";
	}
	static deauthenticate(user) {
		user.authenticated = false;
		user.username = "anonymous";
		localStorage.removeItem(APIUser.TOKEN_KEY);
		return user;
	}
};
var AuthenticatedUser = class AuthenticatedUser extends APIUser {
	constructor(token) {
		super();
		const jsonPayload = jwtDecode(token);
		console.log("Token payload", jsonPayload);
		this.token = token;
		this.authenticated = true;
		this.username = jsonPayload.username;
	}
	static authenticate(token) {
		const authenticatedUser = new AuthenticatedUser(token);
		localStorage.setItem(APIUser.TOKEN_KEY, token);
		return authenticatedUser;
	}
	static authenticateFromLocalStorage() {
		const priorToken = localStorage.getItem(APIUser.TOKEN_KEY);
		return priorToken ? AuthenticatedUser.authenticate(priorToken) : new APIUser();
	}
};
var AuthService = class AuthService extends Service {
	static {
		this.EVENT_TYPE = "auth:message";
	}
	constructor(context, redirectForLogin) {
		super((msg, model) => this.update(msg, model), context, AuthService.EVENT_TYPE);
		this._redirectForLogin = redirectForLogin;
	}
	update(message, model) {
		switch (message[0]) {
			case "auth/signin":
				const { token, redirect } = message[1];
				return [signIn(token), redirectLater(redirect)];
			case "auth/signout": return [signOut(model), redirectLater(this._redirectForLogin)];
			case "auth/redirect":
				redirectNow(this._redirectForLogin, { next: window.location.href });
				break;
			default:
				const unhandled = message[0];
				throw new Error(`Unhandled Auth message "${unhandled}"`);
		}
		return model;
	}
};
var AuthProvider = class extends Provider {
	get redirect() {
		return this.getAttribute("redirect") || void 0;
	}
	constructor() {
		const user = AuthenticatedUser.authenticateFromLocalStorage();
		const { authenticated, username } = user;
		super({
			authenticated,
			username,
			token: authenticated ? user.token : void 0
		}, AUTH_CONTEXT_DEFAULT);
	}
	connectedCallback() {
		new AuthService(this.context, this.redirect).attach(this);
	}
};
var dispatch = dispatcher(AuthService.EVENT_TYPE);
function redirectLater(redirect, query = {}) {
	return new Promise((resolve) => {
		redirectNow(redirect, query);
		resolve(None);
	});
}
function redirectNow(redirect, query = {}) {
	if (redirect) {
		const base = window.location.href;
		const target = new URL(redirect, base);
		Object.entries(query).forEach(([k, v]) => target.searchParams.set(k, v));
		console.log("Redirecting to ", redirect);
		window.location.assign(target);
	}
}
function signIn(token) {
	const { authenticated, username } = AuthenticatedUser.authenticate(token);
	return {
		authenticated,
		username,
		token
	};
}
function signOut(model) {
	const { authenticated, username } = APIUser.deauthenticate(new APIUser(model.username));
	return {
		username,
		authenticated,
		token: void 0
	};
}
function authHeaders(auth) {
	if (auth.authenticated) return { Authorization: `Bearer ${auth.token || "NO_TOKEN"}` };
	else return {};
}
function tokenPayload(user) {
	if (user.authenticated) return jwtDecode(user.token || "");
	else return {};
}
//#endregion
//#region src/auth/fromAuth.ts
function fromAuth(target, contextLabel = AUTH_CONTEXT_DEFAULT) {
	return fromService(target, contextLabel);
}
//#endregion
export { fromService as a, Provider as c, dispatcher as d, message_exports as f, __toESM as g, __require as h, FromService as i, discover as l, __exportAll as m, auth_exports as n, Service as o, __commonJSMin as p, dispatch as r, Observer as s, fromAuth as t, Dispatch as u };
