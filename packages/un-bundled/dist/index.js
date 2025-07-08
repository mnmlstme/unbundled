import { css, define, html, shadow } from "./html.js";
import { M, T, a } from "./template-DgcdTw4L.js";
import { EffectsManager, createEffect } from "./effects.js";
import { Context } from "./context.js";
import { View, ViewModel, createContext, createObservable, createViewModel, fromInputs } from "./context.js";
class Dispatch extends CustomEvent {
  constructor(msg, eventType = "mu:message") {
    super(eventType, {
      bubbles: true,
      composed: true,
      detail: msg
    });
  }
}
function dispatcher(eventType = "mu:message") {
  return (target, ...msg) => target.dispatchEvent(new Dispatch(msg, eventType));
}
const dispatch$1 = dispatcher();
const _Provider = class _Provider extends HTMLElement {
  constructor(init) {
    super();
    console.log("Constructing context provider", this);
    this.context = new Context(init, this);
    this.style.display = "contents";
  }
  attach(observer) {
    this.addEventListener(_Provider.CONTEXT_CHANGE_EVENT, observer);
    return observer;
  }
  detach(observer) {
    this.removeEventListener(_Provider.CONTEXT_CHANGE_EVENT, observer);
  }
};
_Provider.CONTEXT_CHANGE_EVENT = `un-provider:change`;
let Provider = _Provider;
function whenProviderReady(consumer, contextLabel) {
  const provider = closestProvider(contextLabel, consumer);
  return new Promise((resolve, reject) => {
    if (provider) {
      const name = provider.localName;
      customElements.whenDefined(name).then(() => resolve(provider));
    } else {
      reject({
        context: contextLabel,
        reason: `No provider for this context "${contextLabel}:`
      });
    }
  });
}
function closestProvider(contextLabel, el) {
  const selector = `[provides="${contextLabel}"]`;
  if (!el || el === document.getRootNode()) return void 0;
  const closest = el.closest(selector);
  if (closest) return closest;
  const root = el.getRootNode();
  if (root instanceof ShadowRoot)
    return closestProvider(contextLabel, root.host);
  return void 0;
}
class Service {
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
      console.log(`Starting ${this._eventType} service`);
      this._running = true;
      this._pending.forEach((msg) => this.process(msg));
    }
  }
  apply(fn) {
    this._context.apply(fn);
  }
  consume(message) {
    if (this._running) {
      this.process(message);
    } else {
      console.log(`Queueing ${this._eventType} message`, message);
      this._pending.push(message);
    }
  }
  process(message) {
    console.log(`Processing ${this._eventType} message`, message);
    const command = this._update(message, this.apply.bind(this));
    if (command) command(this._context.value);
  }
}
function identity(model) {
  return model;
}
function replace(replacements) {
  return (model) => ({ ...model, ...replacements });
}
class InvalidTokenError extends Error {
}
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
    let code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = "0" + code;
    }
    return "%" + code;
  }));
}
function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw new Error("base64 string is not of the correct length");
  }
  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
}
function jwtDecode(token, options) {
  if (typeof token !== "string") {
    throw new InvalidTokenError("Invalid token specified: must be a string");
  }
  options || (options = {});
  const pos = options.header === true ? 0 : 1;
  const part = token.split(".")[pos];
  if (typeof part !== "string") {
    throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
  }
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
const _APIUser = class _APIUser {
  constructor() {
    this.authenticated = false;
    this.username = "anonymous";
  }
  static deauthenticate(user) {
    user.authenticated = false;
    user.username = "anonymous";
    localStorage.removeItem(_APIUser.TOKEN_KEY);
    return user;
  }
};
_APIUser.TOKEN_KEY = "un-auth:token";
let APIUser = _APIUser;
class AuthenticatedUser extends APIUser {
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
}
const _AuthService = class _AuthService extends Service {
  constructor(context, redirectForLogin) {
    super(
      (msg, apply) => this.update(msg, apply),
      context,
      _AuthService.EVENT_TYPE
    );
    this._redirectForLogin = redirectForLogin;
  }
  update(message, apply) {
    switch (message[0]) {
      case "auth/signin":
        const { token, redirect } = message[1];
        apply(signIn(token));
        return redirection(redirect);
      case "auth/signout":
        apply(signOut());
        return redirection(this._redirectForLogin);
      case "auth/redirect":
        return redirection(this._redirectForLogin, {
          next: window.location.href
        });
      default:
        const unhandled = message[0];
        throw new Error(`Unhandled Auth message "${unhandled}"`);
    }
  }
};
_AuthService.EVENT_TYPE = "auth:message";
let AuthService = _AuthService;
class AuthProvider extends Provider {
  get redirect() {
    return this.getAttribute("redirect") || void 0;
  }
  constructor() {
    const user = AuthenticatedUser.authenticateFromLocalStorage();
    super({
      user,
      token: user.authenticated ? user.token : void 0
    });
  }
  connectedCallback() {
    const service = new AuthService(this.context, this.redirect);
    service.attach(this);
  }
}
const dispatch = dispatcher(AuthService.EVENT_TYPE);
function redirection(redirect, query = {}) {
  if (!redirect) return void 0;
  const base = window.location.href;
  const target = new URL(redirect, base);
  Object.entries(query).forEach(([k, v]) => target.searchParams.set(k, v));
  return () => {
    console.log("Redirecting to ", redirect);
    window.location.assign(target);
  };
}
function signIn(token) {
  return replace({
    user: AuthenticatedUser.authenticate(token),
    token
  });
}
function signOut() {
  return (model) => {
    const oldUser = model.user;
    return {
      user: oldUser && oldUser.authenticated ? APIUser.deauthenticate(oldUser) : oldUser,
      token: ""
    };
  };
}
function authHeaders(user) {
  if (user.authenticated) {
    const authUser = user;
    return {
      Authorization: `Bearer ${authUser.token || "NO_TOKEN"}`
    };
  } else {
    return {};
  }
}
function tokenPayload(user) {
  if (user.authenticated) {
    const authUser = user;
    return jwtDecode(authUser.token || "");
  } else {
    return {};
  }
}
const auth = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AuthenticatedUser,
  Provider: AuthProvider,
  User: APIUser,
  dispatch,
  headers: authHeaders,
  payload: tokenPayload
}, Symbol.toStringTag, { value: "Module" }));
export {
  auth as Auth,
  Context,
  Dispatch,
  EffectsManager,
  M as Mutation,
  Provider,
  Service,
  T as TagContentMutation,
  a as TemplateParser,
  View,
  ViewModel,
  createContext,
  createEffect,
  createObservable,
  createViewModel,
  css,
  define,
  dispatch$1 as dispatch,
  dispatcher,
  fromInputs,
  html,
  identity,
  replace,
  shadow,
  whenProviderReady
};
