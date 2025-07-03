import { ViewTemplate } from "../html";
import { createObservable } from "./observable.ts";

// type ViewModelValue = string | number | boolean | object | undefined;

export type ViewModelPlugin<T extends object> = (host: ViewModel<T>) => object;

export class ViewModel<T extends object> {
  object: T;
  proxy: T;
  pluginsLoaded: object[];

  constructor(init: T, ...plugins: ViewModelPlugin<T>[]) {
    this.object = init;
    this.proxy = createObservable(this.object);
    this.pluginsLoaded = plugins.map((s) => s(this));
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
