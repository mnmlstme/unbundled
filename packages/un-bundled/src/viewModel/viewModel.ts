import { ViewTemplate } from "../html";
import { createObservable } from "./observable.ts";

export class ViewModel<T extends object> {
  proxy: T;

  constructor(init: T) {
    this.proxy = createObservable(init);
  }

  get(prop: keyof T) {
    return this.proxy[prop];
  }

  set(prop: keyof T, value: any) {
    this.proxy[prop] = value;
  }

  render(view: ViewTemplate<T>, scope = this.proxy) {
    return view.render(scope);
  }

  static map<S extends object>(view: ViewTemplate<S>, list: Array<S>) {
    return list.map(($) => view.render($));
  }
}
