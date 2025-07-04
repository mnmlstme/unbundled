const EVENT_PREFIX = "un-context";
const CONTEXT_CHANGE_EVENT = `${EVENT_PREFIX}:change`;

export class Context<T extends object> {
  _proxy: T;

  constructor(init: T, host: HTMLElement) {
    this._proxy = createContext<T>(init, host);
  }

  get value() {
    return this._proxy;
  }

  set value(next: T) {
    Object.assign(this._proxy, next);
  }

  apply(mapFn: (t: T) => T) {
    this.value = mapFn(this.value);
  }
}



export function createContext<T extends object>(
  root: T,
  eventTarget: HTMLElement
): T {
  let proxy = new Proxy<T>(root, {
    get: (target, prop: string, receiver) => {
      if (prop === "then") {
        return undefined;
      }
      const value = Reflect.get(target, prop, receiver);
      console.log(`Context['${prop}'] => `, value);
      return value;
    },
    set: (target, prop: string, newValue, receiver) => {
      const oldValue = root[prop as keyof T];
      console.log(
        `Context['${prop.toString()}'] <= `,
        newValue
      );
      const didSet = Reflect.set(
        target,
        prop,
        newValue,
        receiver
      );
      if (didSet) {
        let evt = new CustomEvent(CONTEXT_CHANGE_EVENT, {
          bubbles: true,
          cancelable: true,
          composed: true
        });
        Object.assign(evt, {
          property: prop,
          oldValue,
          value: newValue
        });
        eventTarget.dispatchEvent(evt);
      } else {
        console.log(
          `Context['${prop}] was not set to ${newValue}`
        );
      }
      return didSet;
    }
  });

  return proxy;
}

