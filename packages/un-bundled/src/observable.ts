import { EffectsManager } from "./effects.ts";

export function createObservable<T extends object>(root: T) {
  const subscriptions: EffectsManager<T> = new EffectsManager();

  let proxy = new Proxy(root, {
    get: (subject: T, prop: string, receiver) => {
      if (prop === "then") {
        return undefined;
      }
      const value = Reflect.get(subject, prop, receiver);
      if (isObservable(value)) {
        console.log("Observed: ", prop, value, subject);
        subscriptions.subscribe(prop);
      }
      return value;
    },
    set: (subject: T, prop: string, newValue, receiver) => {
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

function isObservable(value: unknown) {
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
