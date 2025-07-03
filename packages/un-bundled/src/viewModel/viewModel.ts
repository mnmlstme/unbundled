import { ViewTemplate } from "../html";
import { createEffect } from "../effects";
import { createObservable } from "./observable.ts";

type ViewModelValue = string | number | boolean | object | undefined;

export class ViewModel<T extends object> {
  object: T;
  proxy: T;

  constructor(init: T) {
    this.object = initializeViewModel(init);
    this.proxy = createObservable(this.object);
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
