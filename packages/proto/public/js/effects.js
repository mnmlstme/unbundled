import { HtmlEffect } from "@un-bundled/unbundled";

export function fx( viewFn ) {
  return new HtmlEffect(
    ($, root) => createEffect(
      () => renderEffect(viewFn($), root )
    )
  );
}

function renderEffect(v, root) {
  switch(typeof v) {
    case "object":
      if (Array.isArray(v)) {
        root.replaceChildren();
        v.forEach((frag) => root.append(frag));
      } else {
        root.replaceChildren(v);
      }
      break;
    case "string":
      root.textContent = v;
      break;
    case "number":
    case "boolean":
      root.textContent = v.toString();
      break;
    case "undefined":
      root.replaceChildren(
        new Comment("[undefined effect result]")
      );
      break;
    default:
      root.replaceChildren(
        new Comment(`[invalid effect result of type "${typeof v}"]`)
      );
  }
}

const $context = [];

export function createEffect(fn) {
    const effect = {
        execute() {
            $context.push(effect);
            fn();
            $context.pop();
        }
    }

    effect.execute();
}


export function createObservable(root) {
  const subscriptions = [];

  let proxy = new Proxy(root, {
    get: (target, prop, receiver) => {
      if (prop === "then") {
        return undefined;
      }
      const value = Reflect.get(target, prop, receiver);
      if (isObservable(value)) {
        if ($context.length) {
          const effect = $context.at(-1);
          console.log("👀 from observer:", effect);
          addSubscription(prop, effect)
        }
        console.log(`Observable['${prop}'] => `, value)
      }
      return value;
    },
    set: (target, prop, newValue, receiver) => {
      const oldValue = root[prop];
      console.log(`‼️ Observable['${prop}'] <=`, newValue);
      const didSet = Reflect.set(target, prop, newValue, receiver);
      if (isObservable(newValue)) {
        if (didSet) {
          console.log(`🪃 Running effects for Observable['${prop}] <=`, newValue);
          runSubscribers(prop);
        } else {
          console.log(`⛔️ Observable['${prop}] was not set to ${newValue}`);
        }
      }
      return didSet;
    },
  });

  return proxy;

  function addSubscription(prop, effect) {
    if (!subscriptions[prop]) subscriptions[prop] = new Set();
    const set = subscriptions[prop];
    set.add(effect);
  }

  function runSubscribers(prop) {
    const set = subscriptions[prop];
    if (set) {
      console.log("Iterating over", set);
      for (const effect of set) {
        effect.execute();
      }
    }
  }
}

function isObservable(value) {
  switch(typeof value){
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
