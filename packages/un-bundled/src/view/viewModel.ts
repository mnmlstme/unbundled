import { Context } from "../effects/index.ts";
import { Source } from "./source.ts";
import { RenderFunction, ViewTemplate, View } from "./view.ts";
import { DynamicDocumentFragment, TemplateParameter } from "../html/index.ts";

export type ViewModelPlugin<T extends object> = (host: ViewModel<T>) => object;

export class ViewModel<T extends object> extends Context<T> {
  constructor(init: Partial<T>, adoptedContext?: Context<T>) {
    super(init as T, adoptedContext);
  }

  html(
    template: TemplateStringsArray,
    ...params: Array<TemplateParameter | RenderFunction<T>>
  ): DynamicDocumentFragment {
    const view = View.html<T>(template, ...params);
    return this.render(view);
  }

  merge<S extends object>(
    other: Partial<S>,
    source?: Source<S>
  ): ViewModel<T & S> {
    const merged = new ViewModel<T & S>(
      Object.assign(this.toObject(), other),
      this as unknown as Context<T & S>
    );

    if (source) {
      const inputNames = Object.keys(other) as (keyof S)[];
      source
        .start((name: keyof S, value: any) => {
          // console.log("Merging effect", name, value, inputNames);
          if (inputNames.includes(name)) merged.set(name, value);
        })
        .then((firstObservation: S) => {
          // console.log("ViewModel source observed:", firstObservation);
          merged.update(firstObservation);
        });
    }

    return merged;
  }

  render(view: ViewTemplate<T>): DynamicDocumentFragment {
    // console.log("Rendering view, scope=", this.toObject());
    return view.render(this);
  }
}

export function createViewModel<T extends object>(
  init?: Partial<T>
): ViewModel<T> {
  return new ViewModel<T>(init || {});
}
