"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const effects = require("./effects.cjs");
function createObservable(root) {
  const subscriptions = new effects.EffectsManager();
  let proxy = new Proxy(root, {
    get: (subject, prop, receiver) => {
      if (prop === "then") {
        return void 0;
      }
      const value = Reflect.get(subject, prop, receiver);
      if (isObservable(value)) {
        console.log("Observed: ", prop, value, subject);
        subscriptions.subscribe(prop);
      }
      return value;
    },
    set: (subject, prop, newValue, receiver) => {
      const didSet = Reflect.set(subject, prop, newValue, receiver);
      if (didSet && isObservable(newValue)) {
        console.log("Changed: ", prop, newValue, subject);
        subscriptions.runEffects(prop, subject);
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
    case "boolean":
    case "undefined":
      return true;
    default:
      return false;
  }
}
class ViewModel {
  constructor(init) {
    this.object = initializeViewModel(init);
    this.proxy = createObservable(this.object);
  }
  get(prop) {
    return this.proxy[prop];
  }
  set(prop, value) {
    this.proxy[prop] = value;
  }
  toObject() {
    return Object.assign({}, this.object);
  }
  render(view, scope = this.proxy) {
    return view.render(scope);
  }
  static map(view, list) {
    return list.map(($) => view.render($));
  }
}
function initializeViewModel(init) {
  return init;
}
exports.ViewModel = ViewModel;
exports.createObservable = createObservable;
