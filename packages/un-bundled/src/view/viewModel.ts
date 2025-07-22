import { Context } from "../effects/index.ts";
import { Source } from "./source.ts";
import { ViewTemplate } from "./view.ts";
import { DynamicDocumentFragment } from "../html/index.ts";

export type ViewModelPlugin<T extends object> = (host: ViewModel<T>) => object;

export class ViewModel<T extends object> extends Context<T> {
  constructor(init: Partial<T>, adoptedContext?: Context<T>) {
    super(init as T, adoptedContext);
  }

  get $() {
    return this.toObject();
  }

  merge<S extends object>(
    more: Partial<T> & Partial<S>,
    source?: Source<S>
  ): ViewModel<T> {
    if (source) {
      const inputNames = Object.keys(more) as (keyof S & keyof T)[];
      source
        .start((name: keyof S, value: any) => {
          // console.log("Merging effect", name, value, inputNames);
          if (inputNames.includes(name as keyof T & keyof S))
            this.set(name as keyof T & keyof S, value);
        })
        .then((firstObservation: Partial<S>) => {
          // console.log("ViewModel source observed:", firstObservation);
          inputNames.forEach((name) => this.set(name, firstObservation[name]));
        });
    }

    return this;
  }

  render(view: ViewTemplate<T>): DynamicDocumentFragment {
    // console.log("Rendering view, scope=", this.toObject());
    return view.render(this);
  }
}

export function createViewModel<T extends object>(init?: T): ViewModel<T> {
  return new ViewModel<T>(init || {});
}
