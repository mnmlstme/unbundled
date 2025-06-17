
export function viewModel(element, init = {}) {
  return createObservable(element, init);
}

function createObservable(eventTarget, root) {
  const OBSERVABLE_CHANGE_EVENT = "observable:change";

  console.log("creating Observable:", JSON.stringify(root));

  let proxy = new Proxy(root, {
    get: (target, prop, receiver) => {
      if (prop === "then") {
        return undefined;
      }
      const value = Reflect.get(target, prop, receiver);
      console.log(`Observable['${prop}'] => ${JSON.stringify(value)}`);
      return value;
    },
    set: (target, prop, newValue, receiver) => {
      const oldValue = root[prop];
      console.log(
        `Observable['${prop}'] <= ${JSON.stringify(
          newValue
        )}; was ${JSON.stringify(oldValue)}`
      );
      const didSet = Reflect.set(target, prop, newValue, receiver);
      if (didSet) {
        let evt = new CustomEvent(OBSERVABLE_CHANGE_EVENT, {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: [prop, oldValue, newValue]
        });
        Object.assign(evt, { property: prop, oldValue, value: newValue });
        eventTarget.dispatchEvent(evt);
        console.log("dispatched event to target", evt, eventTarget);
      } else {
        console.log(`Observable['${prop}] was not set to ${newValue}`);
      }
      return didSet;
    },
  });

  return proxy;
}
