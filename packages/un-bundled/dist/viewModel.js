import { EffectsManager } from "./effects.js";
function createObservable(root) {
  const subscriptions = new EffectsManager();
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
    this.proxy = createObservable(init);
  }
  get(prop) {
    return this.proxy[prop];
  }
  set(prop, value) {
    this.proxy[prop] = value;
  }
  render(view, scope = this.proxy) {
    return view.render(scope);
  }
  static map(view, list) {
    return list.map(($) => view.render($));
  }
}
export {
  ViewModel,
  createObservable
};
