import { Effector } from "./effect.ts";
import { EffectsManager } from "./manager.ts";

export class Context<T extends object> {
  private manager: EffectsManager<T>;
  private object: T;
  private proxy: T;

  static CHANGE_EVENT_TYPE = "un-context:change";

  constructor(init: T, adoptedContext?: Context<T>) {
    if (adoptedContext) {
      this.manager = adoptedContext.manager;
      this.object = adoptedContext.object;
      this.proxy = adoptedContext.proxy;
      this.update(init);
    } else {
      this.manager = new EffectsManager<T>();
      this.object = init;
      this.proxy = createContext<T>(this.object, this.manager);
    }
  }

  get(prop: keyof T) {
    return this.proxy[prop];
  }

  set(prop: keyof T, value: any) {
    this.proxy[prop] = value;
  }

  toObject(): T {
    return this.object;
  }

  update(next: Partial<T>) {
    Object.assign(this.proxy, next);
  }

  apply(mapFn: (t: T) => Partial<T>) {
    this.update(mapFn(this.toObject()));
  }

  createEffect(fn: Effector<T>): void {
    const manager = this.manager;
    const effect = {
      execute($: T) {
        manager.start(effect);
        fn($);
        manager.stop();
      }
    };
    console.log("Executing created effect:", effect, fn);
    effect.execute(this.proxy);
  }

  setHost(host: EventTarget, eventType?: string) {
    this.manager.setHost(host, eventType);
  }
}

export function createContext<T extends object>(
  root: T,
  manager: EffectsManager<T>
) {
  let proxy = new Proxy(root, {
    get: (subject: T, prop: string, receiver) => {
      const value = Reflect.get(subject, prop, receiver);
      console.log("Got value of signal", prop, value);
      if (manager.isRunning() && isObservable(value)) {
        manager.subscribe(prop as keyof T);
      }
      return value;
    },
    set: (subject: T, prop: string, newValue, receiver) => {
      const didSet = Reflect.set(subject, prop, newValue, receiver);
      if (didSet && isObservable(newValue)) {
        manager.runEffects(prop as keyof T, subject);
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
