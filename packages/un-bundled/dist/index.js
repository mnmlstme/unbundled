import { css, define, html, shadow } from "./html.js";
import { M, T, a } from "./template-B9lxuhGz.js";
import { C as Context } from "./context-BNE4sWaw.js";
import { E, S, c } from "./context-BNE4sWaw.js";
import { DirectEffect } from "./effects.js";
import { View, ViewModel, createViewModel, fromAttributes, fromInputs } from "./view.js";
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
  constructor(init, label) {
    super();
    this.contextLabel = label;
    this.context = new Context(init);
    this.context.setHost(this, _Provider.CHANGE_EVENT);
    this.addEventListener(_Provider.DISCOVERY_EVENT, (event) => {
      const [contextLabel, respondFn] = event.detail;
      if (contextLabel === this.contextLabel) {
        event.stopPropagation();
        respondFn(this);
      }
    });
  }
  attach(observer) {
    this.addEventListener(_Provider.CHANGE_EVENT, observer);
    return this.context.toObject();
  }
  detach(observer) {
    this.removeEventListener(_Provider.CHANGE_EVENT, observer);
  }
};
_Provider.DISCOVERY_EVENT = "un-provider:discover";
_Provider.CHANGE_EVENT = "un-provider:change";
document.addEventListener(_Provider.DISCOVERY_EVENT, (event) => {
  const [contextLabel, respondFn] = event.detail;
  console.log("No response from provider:", contextLabel);
  respondFn(null);
});
let Provider = _Provider;
function discover(observer, contextLabel) {
  return new Promise((resolve, reject) => {
    const discoveryEvent = new CustomEvent(Provider.DISCOVERY_EVENT, {
      bubbles: true,
      composed: true,
      detail: [
        contextLabel,
        (provider) => provider ? resolve(provider) : reject()
      ]
    });
    observer.dispatchEvent(discoveryEvent);
  });
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
      this._pending.push(message);
    }
  }
  process(message) {
    const command = this._update(message, this.apply.bind(this));
    if (command) command(this._context);
  }
}
function identity(model) {
  return model;
}
function replace(replacements) {
  return (model) => ({ ...model, ...replacements });
}
class Observer {
  constructor(contextLabel) {
    this.contextLabel = contextLabel;
  }
  observe(from, fn) {
    return new Promise((resolve, reject) => {
      if (this.provider) {
        resolve(this.attachObserver(fn));
      } else {
        discover(from, this.contextLabel).then((provider) => {
          this.provider = provider;
          resolve(this.attachObserver(fn));
        }).catch((err) => reject(err));
      }
    });
  }
  attachObserver(fn) {
    const effect = new DirectEffect(fn);
    const init = this.provider.attach((ev) => {
      const { property, value } = ev.detail;
      if (this.observed) {
        this.observed[property] = value;
        effect.execute({ property, value });
      }
    });
    this.observed = init;
    return init;
  }
}
function fromService(target, contextLabel) {
  return new FromService(target, contextLabel);
}
class FromService {
  constructor(client, contextLabel) {
    this.client = client;
    this.observer = new Observer(contextLabel);
  }
  start(fn) {
    return this.observer.observe(this.client, (s) => {
      fn(s.property, s.value);
    });
  }
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
const AUTH_CONTEXT_DEFAULT = "context:auth";
const _APIUser = class _APIUser {
  constructor(username) {
    this.authenticated = false;
    this.username = username || "anonymous";
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
    const { authenticated, username } = user;
    super(
      {
        authenticated,
        username,
        token: authenticated ? user.token : void 0
      },
      AUTH_CONTEXT_DEFAULT
    );
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
    window.location.assign(target);
  };
}
function signIn(token) {
  const user = AuthenticatedUser.authenticate(token);
  const { authenticated, username } = user;
  return replace({
    authenticated,
    username,
    token
  });
}
function signOut() {
  return (model) => {
    const oldUser = APIUser.deauthenticate(new APIUser(model.username));
    const { authenticated, username } = oldUser;
    return {
      username,
      authenticated
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
  CONTEXT_DEFAULT: AUTH_CONTEXT_DEFAULT,
  Provider: AuthProvider,
  User: APIUser,
  dispatch,
  headers: authHeaders,
  payload: tokenPayload
}, Symbol.toStringTag, { value: "Module" }));
function fromAuth(target, contextLabel = AUTH_CONTEXT_DEFAULT) {
  return new FromService(target, contextLabel);
}
export {
  auth as Auth,
  Context,
  DirectEffect,
  Dispatch,
  E as EffectsManager,
  FromService,
  M as Mutation,
  Provider,
  Service,
  S as SignalEvent,
  T as TagContentMutation,
  a as TemplateParser,
  View,
  ViewModel,
  c as createContext,
  createViewModel,
  css,
  define,
  discover,
  dispatch$1 as dispatch,
  dispatcher,
  fromAttributes,
  fromAuth,
  fromInputs,
  fromService,
  html,
  identity,
  replace,
  shadow
};
