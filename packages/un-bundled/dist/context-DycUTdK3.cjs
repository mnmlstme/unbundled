"use strict";
class SignalEvent extends CustomEvent {
  constructor(eventType, signal) {
    super(eventType, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: signal
    });
  }
}
class EffectsManager {
  constructor() {
    this.signals = /* @__PURE__ */ new Map();
    this.running = [];
    this.eventType = "un-effect:change";
  }
  isRunning() {
    return this.running.length > 0;
  }
  start(effect) {
    this.running.push(effect);
  }
  stop() {
    this.running.pop();
  }
  current() {
    const len = this.running.length;
    return len ? this.running[len - 1] : void 0;
  }
  subscribe(key) {
    const current = this.current();
    if (current) {
      let signal = this.signals.get(key);
      if (!signal) this.signals.set(key, signal = /* @__PURE__ */ new Set());
      signal.add(current);
    }
  }
  runEffects(key, scope) {
    const signal = this.signals.get(key);
    if (signal) {
      for (const effect of signal) {
        effect.execute(scope);
      }
    }
    if (this.host) {
      const evt = new SignalEvent(this.eventType, {
        property: key,
        value: scope[key]
      });
      this.host.dispatchEvent(evt);
    }
  }
  setHost(host, eventType) {
    this.host = host;
    if (eventType) this.eventType = eventType;
  }
}
const _Context = class _Context {
  constructor(init, adoptedContext) {
    if (adoptedContext) {
      this.manager = adoptedContext.manager;
      this.object = adoptedContext.object;
      this.proxy = adoptedContext.proxy;
      this.update(init);
    } else {
      this.manager = new EffectsManager();
      this.object = init;
      this.proxy = createContext(this.object, this.manager);
    }
  }
  get(prop) {
    return this.proxy[prop];
  }
  set(prop, value) {
    this.proxy[prop] = value;
  }
  toObject() {
    return this.object;
  }
  update(next) {
    Object.assign(this.proxy, next);
  }
  apply(mapFn) {
    this.update(mapFn(this.toObject()));
  }
  createEffect(fn) {
    const manager = this.manager;
    const effect = {
      execute($) {
        manager.start(effect);
        fn($);
        manager.stop();
      }
    };
    effect.execute(this.proxy);
  }
  setHost(host, eventType) {
    this.manager.setHost(host, eventType);
  }
};
_Context.CHANGE_EVENT_TYPE = "un-context:change";
let Context = _Context;
function createContext(root, manager) {
  let proxy = new Proxy(root, {
    get: (subject, prop, receiver) => {
      const value = Reflect.get(subject, prop, receiver);
      if (manager.isRunning() && isObservable(value)) {
        manager.subscribe(prop);
      }
      return value;
    },
    set: (subject, prop, newValue, receiver) => {
      const didSet = Reflect.set(subject, prop, newValue, receiver);
      if (didSet && isObservable(newValue)) {
        manager.runEffects(prop, subject);
      }
      return didSet;
    }
  });
  return proxy;
}
function isObservable(value) {
  switch (typeof value) {
    case "object":
    case "number":
    case "string":
    case "symbol":
    case "boolean":
    case "undefined":
      return true;
    default:
      return false;
  }
}
exports.Context = Context;
exports.EffectsManager = EffectsManager;
exports.SignalEvent = SignalEvent;
exports.createContext = createContext;
