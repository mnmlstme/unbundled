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
function createEffect(fn, ...scope) {
  const effect = {
    execute() {
      const args = scope.map(
        (cx) => cx instanceof Context ? cx.open(effect) : cx
      );
      fn(...args);
      scope.forEach(
        (cx) => cx instanceof Context && cx.close()
      );
    }
  };
  effect.execute();
}
const _Scheduler = class _Scheduler {
  constructor() {
    this.signals = /* @__PURE__ */ new WeakMap();
    this.scheduled = /* @__PURE__ */ new WeakSet();
  }
  subscribe(scope, key, effect) {
    let signals = this.signals.get(scope);
    if (!signals) {
      signals = /* @__PURE__ */ new Map();
      this.signals.set(scope, signals);
    }
    let signal = signals.get(key);
    if (!signal) {
      signal = /* @__PURE__ */ new Set();
      signals.set(key, signal);
    }
    signal.add(effect);
  }
  scheduleEffects(scope, key) {
    const signals = this.signals.get(scope);
    if (!signals) return;
    const signal = signals.get(key);
    if (signal) {
      for (const effect of signal) {
        if (!this.scheduled.has(effect)) {
          this.scheduled.add(effect);
          setTimeout(() => {
            this.scheduled.delete(effect);
            effect.execute();
          });
        }
      }
    }
  }
};
_Scheduler.scheduler = new _Scheduler();
let Scheduler = _Scheduler;
class EffectsManager {
  constructor() {
    this.running = [];
    this.eventType = "un-effect:change";
  }
  isRunning() {
    return this.running.length > 0;
  }
  push(effect) {
    this.running.push(effect);
  }
  pop() {
    this.running.pop();
  }
  current() {
    const len = this.running.length;
    return len ? this.running[len - 1] : void 0;
  }
  subscribe(key, scope) {
    const current = this.current();
    if (current) {
      Scheduler.scheduler.subscribe(scope, key, current);
    }
  }
  runEffects(key, scope) {
    Scheduler.scheduler.scheduleEffects(scope, key);
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
    createEffect(fn, this);
  }
  setHost(host, eventType) {
    this.manager.setHost(host, eventType);
  }
  open(effect) {
    this.manager.push(effect);
    return this.toObject();
  }
  close() {
    this.manager.pop();
  }
};
_Context.CHANGE_EVENT_TYPE = "un-context:change";
let Context = _Context;
function createContext(root, manager) {
  let proxy = new Proxy(root, {
    get: (subject, prop, receiver) => {
      const value = Reflect.get(subject, prop, receiver);
      if (manager.isRunning() && isObservable(value)) {
        manager.subscribe(prop, subject);
      }
      return value;
    },
    set: (subject, prop, newValue, receiver) => {
      const didSet = Reflect.set(
        subject,
        prop,
        newValue,
        receiver
      );
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
exports.Scheduler = Scheduler;
exports.SignalEvent = SignalEvent;
exports.createContext = createContext;
exports.createEffect = createEffect;
