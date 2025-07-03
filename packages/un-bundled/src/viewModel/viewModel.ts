import { ViewTemplate } from "../html";
import { createObservable } from "./observable.ts";

// type ViewModelValue = string | number | boolean | object | undefined;

export type ObserverSpec<T extends object> = (host: ViewModel<T>) => object;

export class ViewModel<T extends object> {
  object: T;
  proxy: T;
  observers: object[];

  constructor(init: T, ...specs: ObserverSpec<T>[]) {
    this.object = initializeViewModel(init);
    this.proxy = createObservable(this.object);
    this.observers = specs.map((s) => s(this));
  }

  get(prop: keyof T) {
    return this.proxy[prop];
  }

  set(prop: keyof T, value: any) {
    this.proxy[prop] = value;
  }

  toObject(): T {
    return Object.assign({}, this.object);
  }

  render(view: ViewTemplate<T>, scope = this.proxy) {
    return view.render(scope);
  }

  static map<S extends object>(view: ViewTemplate<S>, list: Array<S>) {
    return list.map(($) => view.render($));
  }
}

function initializeViewModel<T extends object>(init: T): T {
  return init;
}

function createObserving<T extends object>(
  viewModel: ViewModel<T>,
  obj: Partial<T>
) {
  console.log("VM Setting up proxy:", viewModel, obj);
  const handler = {
    get: function (target: Partial<T>, property: string) {
      console.log(`VM Getting property ${property}`);
      return target[property];
    },
    set: function (target: Partial<T>, property: string, value: string) {
      console.log(`VM Setting property ${property} to ${value}`);
      target[property] = value;
      return true; // indicates that the setting has been done successfully
    }
  };

  return new Proxy(obj, handler);
}
