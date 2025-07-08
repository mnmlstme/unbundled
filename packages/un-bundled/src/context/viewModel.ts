import { createObservable } from "./observable.ts";
import { createEffect, Effector } from "../effects";
import { Observer } from "./observer";
import { ViewTemplate } from "./view.ts";

export type ViewModelPlugin<T extends object> = (host: ViewModel<T>) => object;

export class ViewModel<T extends object> {
  object: T;
  proxy: T;

  constructor(init: T, adoptedProxy?: T) {
    this.object = init;
    this.proxy = adoptedProxy || createObservable(this.object);
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

  merge<S extends object>(other: S, observer?: Observer<S>): ViewModel<T & S> {
    const merged = new ViewModel<T & S>(
      Object.assign(this.object, other),
      this.proxy as T & S
    );

    if (observer) {
      const inputNames = Object.keys(other) as (keyof S)[];
      observer.setEffect((name: keyof S, value: any) => {
        if (inputNames.includes(name)) merged.set(name, value);
      });
    }

    return merged;
  }

  createEffect(fn: Effector<T>) {
    createEffect(fn, this.object);
  }

  render(view: ViewTemplate<T>, scope = this.proxy) {
    console.log("Rendering view, scope=", scope);
    return view.render(scope);
  }
}

export function createViewModel<T extends object>(init?: T): ViewModel<T> {
  return new ViewModel<T>(init || ({} as T));
}
