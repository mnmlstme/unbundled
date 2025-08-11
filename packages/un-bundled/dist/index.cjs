"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const html$1 = require("./html.cjs");
const template = require("./template-pmg-4rnk.cjs");
const context = require("./context-CnKIlkcw.cjs");
const effects = require("./effects.cjs");
const view = require("./view.cjs");
class Dispatch extends CustomEvent {
  constructor(msg, eventType = "un:message") {
    super(eventType, {
      bubbles: true,
      composed: true,
      detail: msg
    });
  }
}
function dispatcher(eventType = "un:message") {
  return (target, ...msg) => target.dispatchEvent(new Dispatch(msg, eventType));
}
const dispatch$3 = dispatcher();
const message = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Dispatch,
  dispatch: dispatch$3,
  dispatcher
}, Symbol.toStringTag, { value: "Module" }));
const _Provider = class _Provider extends HTMLElement {
  constructor(init, label) {
    super();
    this.contextLabel = label;
    this.context = new context.Context(init);
    this.context.setHost(this, _Provider.CHANGE_EVENT);
    this.addEventListener(_Provider.DISCOVERY_EVENT, (event) => {
      const [contextLabel, respondFn] = event.detail;
      if (contextLabel === this.contextLabel) {
        event.stopPropagation();
        respondFn(this);
      }
    });
    const registryEvent = new CustomEvent(_Provider.REGISTRY_EVENT, {
      bubbles: true,
      composed: true,
      detail: [this.contextLabel, this]
    });
    this.dispatchEvent(registryEvent);
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
_Provider.REGISTRY_EVENT = "un-provider:register";
_Provider.CHANGE_EVENT = "un-provider:change";
document.addEventListener(_Provider.DISCOVERY_EVENT, (event) => {
  const [contextLabel, respondFn] = event.detail;
  const provider = registeredProvider(contextLabel);
  if (provider) {
    respondFn(provider);
  } else {
    console.log("No response from provider:", contextLabel);
  }
});
document.addEventListener(_Provider.REGISTRY_EVENT, (event) => {
  const [contextLabel, provider] = event.detail;
  registerProvider(contextLabel, provider);
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
    if (observer.isConnected) observer.dispatchEvent(discoveryEvent);
    else {
      document.dispatchEvent(discoveryEvent);
    }
  });
}
const registry = {};
function registerProvider(label, provider) {
  registry[label] = provider;
}
function registeredProvider(label) {
  return registry[label];
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
    const effect = new effects.DirectEffect(fn);
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
class Service {
  constructor(update, context2, eventType = "service:message", autostart = true) {
    this._pending = [];
    this._context = context2;
    this._update = update;
    this._eventType = eventType;
    this._running = autostart;
  }
  attach(host) {
    host.addEventListener(this._eventType, (ev) => {
      ev.stopPropagation();
      const message2 = ev.detail;
      this.consume(message2);
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
  consume(message2) {
    if (this._running) {
      this.process(message2);
    } else {
      this._pending.push(message2);
    }
  }
  process(message2) {
    const command = this._update(message2, this.apply.bind(this));
    if (command) command(this._context);
  }
}
function identity(model) {
  return model;
}
function replace(replacements) {
  return (model) => ({ ...model, ...replacements });
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
  constructor(context2, redirectForLogin) {
    super(
      (msg, apply) => this.update(msg, apply),
      context2,
      _AuthService.EVENT_TYPE
    );
    this._redirectForLogin = redirectForLogin;
  }
  update(message2, apply) {
    switch (message2[0]) {
      case "auth/signin":
        const { token, redirect: redirect2 } = message2[1];
        apply(signIn(token));
        return redirection(redirect2);
      case "auth/signout":
        apply(signOut());
        return redirection(this._redirectForLogin);
      case "auth/redirect":
        return redirection(this._redirectForLogin, {
          next: window.location.href
        });
      default:
        const unhandled = message2[0];
        throw new Error(
          `Unhandled Auth message "${unhandled}"`
        );
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
    const service = new AuthService(
      this.context,
      this.redirect
    );
    service.attach(this);
  }
}
const dispatch$2 = dispatcher(AuthService.EVENT_TYPE);
function redirection(redirect2, query = {}) {
  if (!redirect2) return void 0;
  const base = window.location.href;
  const target = new URL(redirect2, base);
  Object.entries(query).forEach(
    ([k, v]) => target.searchParams.set(k, v)
  );
  return () => {
    console.log("Redirecting to ", redirect2);
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
    const oldUser = APIUser.deauthenticate(
      new APIUser(model.username)
    );
    const { authenticated, username } = oldUser;
    return {
      username,
      authenticated,
      token: void 0
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
  dispatch: dispatch$2,
  headers: authHeaders,
  payload: tokenPayload
}, Symbol.toStringTag, { value: "Module" }));
function fromAuth(target, contextLabel = AUTH_CONTEXT_DEFAULT) {
  return new FromService(target, contextLabel);
}
const HISTORY_CONTEXT_DEFAULT = "context:history";
const _HistoryService = class _HistoryService extends Service {
  constructor(context2) {
    super(
      (msg, apply) => this.update(msg, apply),
      context2,
      _HistoryService.EVENT_TYPE
    );
  }
  update(message2, apply) {
    switch (message2[0]) {
      case "history/navigate": {
        const { href, state } = message2[1];
        apply(navigate(href, state));
        break;
      }
      case "history/redirect": {
        const { href, state } = message2[1];
        apply(redirect(href, state));
        break;
      }
    }
  }
};
_HistoryService.EVENT_TYPE = "history:message";
let HistoryService = _HistoryService;
class HistoryProvider extends Provider {
  get base() {
    return this.getAttribute("base") || void 0;
  }
  constructor() {
    super(
      {
        location: document.location,
        state: {}
      },
      HISTORY_CONTEXT_DEFAULT
    );
    this.addEventListener("click", (event) => {
      const linkTarget = originalLinkTarget(event);
      if (linkTarget) {
        const url = new URL(linkTarget.href);
        const location = this.context.get(
          "location"
        );
        if (location && url.origin === location.origin && url.pathname.startsWith(this.base || "/")) {
          console.log("Preventing Click Event on <A>", event);
          event.preventDefault();
          dispatch$1(linkTarget, "history/navigate", {
            href: url.pathname + url.search
          });
        }
      }
    });
    window.addEventListener("popstate", (event) => {
      console.log("Popstate", event.state);
      this.context.update({
        location: document.location,
        state: event.state
      });
    });
  }
  connectedCallback() {
    const service = new HistoryService(this.context);
    service.attach(this);
  }
  attributeChangedCallback() {
  }
}
function originalLinkTarget(event) {
  const current = event.currentTarget;
  const isLink = (el) => el.tagName == "A" && el.href;
  if (event.button !== 0) return void 0;
  if (event.composed) {
    const path = event.composedPath();
    const target = path.find(isLink);
    return target ? target : void 0;
  } else {
    for (let target = event.target; target; target === current ? null : target.parentElement) {
      if (isLink(target)) return target;
    }
    return void 0;
  }
}
function navigate(href, state = {}) {
  history.pushState(state, "", href);
  return () => ({
    location: document.location,
    state: history.state
  });
}
function redirect(href, state = {}) {
  history.replaceState(state, "", href);
  return () => ({
    location: document.location,
    state: history.state
  });
}
const dispatch$1 = dispatcher(HistoryService.EVENT_TYPE);
const history$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CONTEXT_DEFAULT: HISTORY_CONTEXT_DEFAULT,
  HistoryProvider,
  Provider: HistoryProvider,
  Service: HistoryService,
  dispatch: dispatch$1
}, Symbol.toStringTag, { value: "Module" }));
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var compiledGrammar = {};
(function(exports2) {
  var parser2 = function() {
    var o = function(k, v, o2, l) {
      for (o2 = o2 || {}, l = k.length; l--; o2[k[l]] = v) ;
      return o2;
    }, $V0 = [1, 9], $V1 = [1, 10], $V2 = [1, 11], $V3 = [1, 12], $V4 = [5, 11, 12, 13, 14, 15];
    var parser3 = {
      trace: function trace() {
      },
      yy: {},
      symbols_: { "error": 2, "root": 3, "expressions": 4, "EOF": 5, "expression": 6, "optional": 7, "literal": 8, "splat": 9, "param": 10, "(": 11, ")": 12, "LITERAL": 13, "SPLAT": 14, "PARAM": 15, "$accept": 0, "$end": 1 },
      terminals_: { 2: "error", 5: "EOF", 11: "(", 12: ")", 13: "LITERAL", 14: "SPLAT", 15: "PARAM" },
      productions_: [0, [3, 2], [3, 1], [4, 2], [4, 1], [6, 1], [6, 1], [6, 1], [6, 1], [7, 3], [8, 1], [9, 1], [10, 1]],
      performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
        var $0 = $$.length - 1;
        switch (yystate) {
          case 1:
            return new yy.Root({}, [$$[$0 - 1]]);
          case 2:
            return new yy.Root({}, [new yy.Literal({ value: "" })]);
          case 3:
            this.$ = new yy.Concat({}, [$$[$0 - 1], $$[$0]]);
            break;
          case 4:
          case 5:
            this.$ = $$[$0];
            break;
          case 6:
            this.$ = new yy.Literal({ value: $$[$0] });
            break;
          case 7:
            this.$ = new yy.Splat({ name: $$[$0] });
            break;
          case 8:
            this.$ = new yy.Param({ name: $$[$0] });
            break;
          case 9:
            this.$ = new yy.Optional({}, [$$[$0 - 1]]);
            break;
          case 10:
            this.$ = yytext;
            break;
          case 11:
          case 12:
            this.$ = yytext.slice(1);
            break;
        }
      },
      table: [{ 3: 1, 4: 2, 5: [1, 3], 6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: $V0, 13: $V1, 14: $V2, 15: $V3 }, { 1: [3] }, { 5: [1, 13], 6: 14, 7: 5, 8: 6, 9: 7, 10: 8, 11: $V0, 13: $V1, 14: $V2, 15: $V3 }, { 1: [2, 2] }, o($V4, [2, 4]), o($V4, [2, 5]), o($V4, [2, 6]), o($V4, [2, 7]), o($V4, [2, 8]), { 4: 15, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: $V0, 13: $V1, 14: $V2, 15: $V3 }, o($V4, [2, 10]), o($V4, [2, 11]), o($V4, [2, 12]), { 1: [2, 1] }, o($V4, [2, 3]), { 6: 14, 7: 5, 8: 6, 9: 7, 10: 8, 11: $V0, 12: [1, 16], 13: $V1, 14: $V2, 15: $V3 }, o($V4, [2, 9])],
      defaultActions: { 3: [2, 2], 13: [2, 1] },
      parseError: function parseError(str, hash) {
        if (hash.recoverable) {
          this.trace(str);
        } else {
          let _parseError = function(msg, hash2) {
            this.message = msg;
            this.hash = hash2;
          };
          _parseError.prototype = Error;
          throw new _parseError(str, hash);
        }
      },
      parse: function parse(input) {
        var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, TERROR = 2, EOF = 1;
        var args = lstack.slice.call(arguments, 1);
        var lexer2 = Object.create(this.lexer);
        var sharedState = { yy: {} };
        for (var k in this.yy) {
          if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
          }
        }
        lexer2.setInput(input, sharedState.yy);
        sharedState.yy.lexer = lexer2;
        sharedState.yy.parser = this;
        if (typeof lexer2.yylloc == "undefined") {
          lexer2.yylloc = {};
        }
        var yyloc = lexer2.yylloc;
        lstack.push(yyloc);
        var ranges = lexer2.options && lexer2.options.ranges;
        if (typeof sharedState.yy.parseError === "function") {
          this.parseError = sharedState.yy.parseError;
        } else {
          this.parseError = Object.getPrototypeOf(this).parseError;
        }
        var lex = function() {
          var token;
          token = lexer2.lex() || EOF;
          if (typeof token !== "number") {
            token = self.symbols_[token] || token;
          }
          return token;
        };
        var symbol, state, action, r, yyval = {}, p, len, newState, expected;
        while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
            action = this.defaultActions[state];
          } else {
            if (symbol === null || typeof symbol == "undefined") {
              symbol = lex();
            }
            action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            expected = [];
            for (p in table[state]) {
              if (this.terminals_[p] && p > TERROR) {
                expected.push("'" + this.terminals_[p] + "'");
              }
            }
            if (lexer2.showPosition) {
              errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer2.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
            } else {
              errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
            }
            this.parseError(errStr, {
              text: lexer2.match,
              token: this.terminals_[symbol] || symbol,
              line: lexer2.yylineno,
              loc: yyloc,
              expected
            });
          }
          if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
            case 1:
              stack.push(symbol);
              vstack.push(lexer2.yytext);
              lstack.push(lexer2.yylloc);
              stack.push(action[1]);
              symbol = null;
              {
                yyleng = lexer2.yyleng;
                yytext = lexer2.yytext;
                yylineno = lexer2.yylineno;
                yyloc = lexer2.yylloc;
              }
              break;
            case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
              };
              if (ranges) {
                yyval._$.range = [
                  lstack[lstack.length - (len || 1)].range[0],
                  lstack[lstack.length - 1].range[1]
                ];
              }
              r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
              ].concat(args));
              if (typeof r !== "undefined") {
                return r;
              }
              if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
            case 3:
              return true;
          }
        }
        return true;
      }
    };
    var lexer = /* @__PURE__ */ function() {
      var lexer2 = {
        EOF: 1,
        parseError: function parseError(str, hash) {
          if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
          } else {
            throw new Error(str);
          }
        },
        // resets the lexer, sets new input
        setInput: function(input, yy) {
          this.yy = yy || this.yy || {};
          this._input = input;
          this._more = this._backtrack = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = "";
          this.conditionStack = ["INITIAL"];
          this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
          };
          if (this.options.ranges) {
            this.yylloc.range = [0, 0];
          }
          this.offset = 0;
          return this;
        },
        // consumes and returns one char from the input
        input: function() {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
          } else {
            this.yylloc.last_column++;
          }
          if (this.options.ranges) {
            this.yylloc.range[1]++;
          }
          this._input = this._input.slice(1);
          return ch;
        },
        // unshifts one char (or a string) into the input
        unput: function(ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);
          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length - len);
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1);
          this.matched = this.matched.substr(0, this.matched.length - 1);
          if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
          }
          var r = this.yylloc.range;
          this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
          };
          if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          this.yyleng = this.yytext.length;
          return this;
        },
        // When called from action, caches matched text and appends it on next action
        more: function() {
          this._more = true;
          return this;
        },
        // When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
        reject: function() {
          if (this.options.backtrack_lexer) {
            this._backtrack = true;
          } else {
            return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
              text: "",
              token: null,
              line: this.yylineno
            });
          }
          return this;
        },
        // retain first n characters of the match
        less: function(n) {
          this.unput(this.match.slice(n));
        },
        // displays already matched input, i.e. for error messages
        pastInput: function() {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
        },
        // displays upcoming input, i.e. for error messages
        upcomingInput: function() {
          var next = this.match;
          if (next.length < 20) {
            next += this._input.substr(0, 20 - next.length);
          }
          return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
        },
        // displays the character position where the lexing error occurred, i.e. for error messages
        showPosition: function() {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + "\n" + c + "^";
        },
        // test the lexed token: return FALSE when not a match, otherwise return token
        test_match: function(match, indexed_rule) {
          var token, lines, backup;
          if (this.options.backtrack_lexer) {
            backup = {
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
            };
            if (this.options.ranges) {
              backup.yylloc.range = this.yylloc.range.slice(0);
            }
          }
          lines = match[0].match(/(?:\r\n?|\n).*/g);
          if (lines) {
            this.yylineno += lines.length;
          }
          this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
          };
          this.yytext += match[0];
          this.match += match[0];
          this.matches = match;
          this.yyleng = this.yytext.length;
          if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
          }
          this._more = false;
          this._backtrack = false;
          this._input = this._input.slice(match[0].length);
          this.matched += match[0];
          token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
          if (this.done && this._input) {
            this.done = false;
          }
          if (token) {
            return token;
          } else if (this._backtrack) {
            for (var k in backup) {
              this[k] = backup[k];
            }
            return false;
          }
          return false;
        },
        // return next match in input
        next: function() {
          if (this.done) {
            return this.EOF;
          }
          if (!this._input) {
            this.done = true;
          }
          var token, match, tempMatch, index;
          if (!this._more) {
            this.yytext = "";
            this.match = "";
          }
          var rules = this._currentRules();
          for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
              match = tempMatch;
              index = i;
              if (this.options.backtrack_lexer) {
                token = this.test_match(tempMatch, rules[i]);
                if (token !== false) {
                  return token;
                } else if (this._backtrack) {
                  match = false;
                  continue;
                } else {
                  return false;
                }
              } else if (!this.options.flex) {
                break;
              }
            }
          }
          if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
              return token;
            }
            return false;
          }
          if (this._input === "") {
            return this.EOF;
          } else {
            return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
              text: "",
              token: null,
              line: this.yylineno
            });
          }
        },
        // return next match that has a token
        lex: function lex() {
          var r = this.next();
          if (r) {
            return r;
          } else {
            return this.lex();
          }
        },
        // activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
        begin: function begin(condition) {
          this.conditionStack.push(condition);
        },
        // pop the previously active lexer condition state off the condition stack
        popState: function popState() {
          var n = this.conditionStack.length - 1;
          if (n > 0) {
            return this.conditionStack.pop();
          } else {
            return this.conditionStack[0];
          }
        },
        // produce the lexer rule set which is active for the currently active lexer condition state
        _currentRules: function _currentRules() {
          if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
          } else {
            return this.conditions["INITIAL"].rules;
          }
        },
        // return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
        topState: function topState(n) {
          n = this.conditionStack.length - 1 - Math.abs(n || 0);
          if (n >= 0) {
            return this.conditionStack[n];
          } else {
            return "INITIAL";
          }
        },
        // alias for begin(condition)
        pushState: function pushState(condition) {
          this.begin(condition);
        },
        // return the number of states currently on the stack
        stateStackSize: function stateStackSize() {
          return this.conditionStack.length;
        },
        options: {},
        performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
          switch ($avoiding_name_collisions) {
            case 0:
              return "(";
            case 1:
              return ")";
            case 2:
              return "SPLAT";
            case 3:
              return "PARAM";
            case 4:
              return "LITERAL";
            case 5:
              return "LITERAL";
            case 6:
              return "EOF";
          }
        },
        rules: [/^(?:\()/, /^(?:\))/, /^(?:\*+\w+)/, /^(?::+\w+)/, /^(?:[\w%\-~\n]+)/, /^(?:.)/, /^(?:$)/],
        conditions: { "INITIAL": { "rules": [0, 1, 2, 3, 4, 5, 6], "inclusive": true } }
      };
      return lexer2;
    }();
    parser3.lexer = lexer;
    function Parser2() {
      this.yy = {};
    }
    Parser2.prototype = parser3;
    parser3.Parser = Parser2;
    return new Parser2();
  }();
  if (typeof commonjsRequire !== "undefined" && true) {
    exports2.parser = parser2;
    exports2.Parser = parser2.Parser;
    exports2.parse = function() {
      return parser2.parse.apply(parser2, arguments);
    };
  }
})(compiledGrammar);
function createNode(displayName) {
  return function(props, children) {
    return {
      displayName,
      props,
      children: children || []
    };
  };
}
var nodes = {
  Root: createNode("Root"),
  Concat: createNode("Concat"),
  Literal: createNode("Literal"),
  Splat: createNode("Splat"),
  Param: createNode("Param"),
  Optional: createNode("Optional")
};
var parser = compiledGrammar.parser;
parser.yy = nodes;
var parser_1 = parser;
var nodeTypes = Object.keys(nodes);
function createVisitor$2(handlers) {
  nodeTypes.forEach(function(nodeType) {
    if (typeof handlers[nodeType] === "undefined") {
      throw new Error("No handler defined for " + nodeType.displayName);
    }
  });
  return {
    /**
     * Call the given handler for this node type
     * @param  {Object} node    the AST node
     * @param  {Object} context context to pass through to handlers
     * @return {Object}
     */
    visit: function(node, context2) {
      return this.handlers[node.displayName].call(this, node, context2);
    },
    handlers
  };
}
var create_visitor = createVisitor$2;
var createVisitor$1 = create_visitor, escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
function Matcher(options) {
  this.captures = options.captures;
  this.re = options.re;
}
Matcher.prototype.match = function(path) {
  var match = this.re.exec(path), matchParams = {};
  if (!match) {
    return;
  }
  this.captures.forEach(function(capture, i) {
    if (typeof match[i + 1] === "undefined") {
      matchParams[capture] = void 0;
    } else {
      matchParams[capture] = decodeURIComponent(match[i + 1]);
    }
  });
  return matchParams;
};
var RegexpVisitor$1 = createVisitor$1({
  "Concat": function(node) {
    return node.children.reduce(
      (function(memo, child) {
        var childResult = this.visit(child);
        return {
          re: memo.re + childResult.re,
          captures: memo.captures.concat(childResult.captures)
        };
      }).bind(this),
      { re: "", captures: [] }
    );
  },
  "Literal": function(node) {
    return {
      re: node.props.value.replace(escapeRegExp, "\\$&"),
      captures: []
    };
  },
  "Splat": function(node) {
    return {
      re: "([^?]*?)",
      captures: [node.props.name]
    };
  },
  "Param": function(node) {
    return {
      re: "([^\\/\\?]+)",
      captures: [node.props.name]
    };
  },
  "Optional": function(node) {
    var child = this.visit(node.children[0]);
    return {
      re: "(?:" + child.re + ")?",
      captures: child.captures
    };
  },
  "Root": function(node) {
    var childResult = this.visit(node.children[0]);
    return new Matcher({
      re: new RegExp("^" + childResult.re + "(?=\\?|$)"),
      captures: childResult.captures
    });
  }
});
var regexp = RegexpVisitor$1;
var createVisitor = create_visitor;
var ReverseVisitor$1 = createVisitor({
  "Concat": function(node, context2) {
    var childResults = node.children.map((function(child) {
      return this.visit(child, context2);
    }).bind(this));
    if (childResults.some(function(c) {
      return c === false;
    })) {
      return false;
    } else {
      return childResults.join("");
    }
  },
  "Literal": function(node) {
    return decodeURI(node.props.value);
  },
  "Splat": function(node, context2) {
    if (context2[node.props.name]) {
      return context2[node.props.name];
    } else {
      return false;
    }
  },
  "Param": function(node, context2) {
    if (context2[node.props.name]) {
      return context2[node.props.name];
    } else {
      return false;
    }
  },
  "Optional": function(node, context2) {
    var childResult = this.visit(node.children[0], context2);
    if (childResult) {
      return childResult;
    } else {
      return "";
    }
  },
  "Root": function(node, context2) {
    context2 = context2 || {};
    var childResult = this.visit(node.children[0], context2);
    if (!childResult) {
      return false;
    }
    return encodeURI(childResult);
  }
});
var reverse = ReverseVisitor$1;
var Parser = parser_1, RegexpVisitor = regexp, ReverseVisitor = reverse;
Route$2.prototype = /* @__PURE__ */ Object.create(null);
Route$2.prototype.match = function(path) {
  var re = RegexpVisitor.visit(this.ast), matched = re.match(path);
  return matched ? matched : false;
};
Route$2.prototype.reverse = function(params) {
  return ReverseVisitor.visit(this.ast, params);
};
function Route$2(spec) {
  var route2;
  if (this) {
    route2 = this;
  } else {
    route2 = Object.create(Route$2.prototype);
  }
  if (typeof spec === "undefined") {
    throw new Error("A route spec is required");
  }
  route2.spec = spec;
  route2.ast = Parser.parse(spec);
  return route2;
}
var route = Route$2;
var Route = route;
var routeParser = Route;
const Route$1 = /* @__PURE__ */ getDefaultExportFromCjs(routeParser);
function fromHistory(target, contextLabel = HISTORY_CONTEXT_DEFAULT) {
  return new FromService(target, contextLabel);
}
const html = view.View.html;
class Switch extends HTMLElement {
  constructor(routes) {
    super();
    this.viewModel = view.createViewModel({
      authenticated: false
    }).merge(fromAuth(this), ["authenticated", "username"]).merge(fromHistory(this), ["location"]);
    this._cases = [];
    this._routeView = html`<h1>Routing...</h1>`;
    this._routeViewModel = view.createViewModel({
      params: {},
      query: new URLSearchParams()
    });
    this._cases = routes.map((r) => ({
      ...r,
      route: new Route$1(r.path)
    }));
    this.viewModel.createEffect(($) => {
      if ($.location) {
        const nextView = this.routeToView($.location, $.authenticated, $.username);
        if (nextView !== this._routeView) {
          this._routeView = nextView;
          html$1.shadow(this).replace(this._routeViewModel.render(nextView));
        }
      }
    });
  }
  routeToView(location, authenticated = false, username) {
    const m = this.matchRoute(location);
    if (m) {
      if ("view" in m) {
        if (m.auth && m.auth !== "public" && !authenticated) {
          dispatch$2(this, "auth/redirect");
          return html`
              <h1>Redirecting for Login</h1>
            `;
        } else {
          console.log("Loading view, ", m.params, m.query);
          this._routeViewModel.update({
            params: m.params,
            query: m.query,
            user: {
              authenticated,
              username
            }
          });
          return m.view;
        }
      }
      if ("redirect" in m) {
        const redirect2 = m.redirect;
        if (typeof redirect2 === "string") {
          this.redirect(redirect2);
          return html`
              <h1>Redirecting to ${redirect2}…</h1>
            `;
        }
      }
    }
    return html`
      <h1>Not Found</h1>
    `;
  }
  matchRoute(location) {
    const { search, pathname } = location;
    const query = new URLSearchParams(search);
    const path = pathname + search;
    for (const option of this._cases) {
      const params = option.route.match(path);
      if (params) {
        const match = {
          ...option,
          path: pathname,
          params,
          query
        };
        return match;
      }
    }
    return;
  }
  redirect(href) {
    dispatch$1(this, "history/redirect", { href });
  }
}
const _switch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Element: Switch,
  Switch
}, Symbol.toStringTag, { value: "Module" }));
const STORE_CONTEXT_DEFAULT = "context:store";
const _StoreService = class _StoreService extends Service {
  constructor(context2, update) {
    super(
      (message2, apply) => {
        apply((current) => {
          const result = update(current, message2);
          if (!Array.isArray(result)) return result;
          const [next, ...commands] = result;
          commands.forEach(
            (promise) => promise.then((message22) => this.consume(message22))
          );
          return next;
        });
      },
      context2,
      _StoreService.EVENT_TYPE
    );
  }
};
_StoreService.EVENT_TYPE = "store:message";
let StoreService = _StoreService;
class StoreProvider extends Provider {
  constructor(updateFn, init) {
    super(init, STORE_CONTEXT_DEFAULT);
    this.viewModel = view.createViewModel({
      authenticated: false
    }).merge(fromAuth(this), ["authenticated", "username", "token"]);
    this._updateFn = updateFn;
  }
  connectedCallback() {
    const service = new StoreService(
      this.context,
      (model, message2) => this._updateFn(model, message2, this.viewModel.toObject())
    );
    service.attach(this);
  }
}
function dispatch(target, message$1) {
  console.log("📨 Dispatching message:", message$1, target);
  target.dispatchEvent(
    new Dispatch(
      message$1,
      StoreService.EVENT_TYPE
    )
  );
}
const store = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CONTEXT_DEFAULT: STORE_CONTEXT_DEFAULT,
  Provider: StoreProvider,
  Service: StoreService,
  StoreService,
  dispatch
}, Symbol.toStringTag, { value: "Module" }));
function fromStore(target, contextLabel = STORE_CONTEXT_DEFAULT) {
  return new FromService(target, contextLabel);
}
exports.Events = html$1.Events;
exports.css = html$1.css;
exports.define = html$1.define;
exports.html = html$1.html;
exports.shadow = html$1.shadow;
exports.Mutation = template.Mutation;
exports.TagContentMutation = template.TagContentMutation;
exports.TemplateParser = template.TemplateParser;
exports.Context = context.Context;
exports.EffectsManager = context.EffectsManager;
exports.SignalEvent = context.SignalEvent;
exports.createContext = context.createContext;
exports.DirectEffect = effects.DirectEffect;
exports.View = view.View;
exports.ViewModel = view.ViewModel;
exports.createView = view.createView;
exports.createViewModel = view.createViewModel;
exports.fromAttributes = view.fromAttributes;
exports.fromInputs = view.fromInputs;
exports.Auth = auth;
exports.FromService = FromService;
exports.History = history$1;
exports.Message = message;
exports.Observer = Observer;
exports.Provider = Provider;
exports.Service = Service;
exports.Store = store;
exports.Switch = _switch;
exports.discover = discover;
exports.fromAuth = fromAuth;
exports.fromHistory = fromHistory;
exports.fromService = fromService;
exports.fromStore = fromStore;
exports.identity = identity;
exports.replace = replace;
