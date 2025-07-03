"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const effects = require("./effects.cjs");
function createObservable(root) {
  const subscriptions = new effects.EffectsManager();
  let proxy = new Proxy(root, {
    get: (subject, prop, receiver) => {
      const value = Reflect.get(subject, prop, receiver);
      if (isObservable(value)) {
        console.log("Observed: ", prop, value, subject);
        subscriptions.subscribe(prop);
      }
      return value;
    },
    set: (subject, prop, newValue, receiver) => {
      const didSet = Reflect.set(subject, prop, newValue, receiver);
      console.log("Changed: ", prop, newValue, subject);
      if (didSet && isObservable(newValue)) {
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
  constructor(init, ...plugins) {
    this.object = init;
    this.proxy = createObservable(this.object);
    this.pluginsLoaded = plugins.map((s) => s(this));
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
function fromInputs(target, init) {
  return (vm) => new FromInputs(target, init, vm);
}
class FromInputs {
  constructor(target, init, vm) {
    this.inputNames = Object.keys(init);
    for (const name in init) vm.set(name, init[name]);
    target.addEventListener("change", (event) => {
      const input = event.target;
      if (input) {
        const name = input.name;
        const value = input.value;
        if (this.inputNames.includes(name)) vm.set(name, value);
      }
    });
  }
}
exports.ViewModel = ViewModel;
exports.createObservable = createObservable;
exports.fromInputs = fromInputs;
