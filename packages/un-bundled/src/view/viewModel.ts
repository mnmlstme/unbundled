import { Context } from "../effects";
import { MappedSource, NameMapping, Source } from "./source.ts";
import { Template } from "../html";

export type ViewState<T = object> = { [K in keyof Partial<T>]: any }

export class ViewModel<T extends ViewState<T>> extends Context<T> {
  constructor(init: Partial<T>, adoptedContext?: Context<T>) {
    super(init as T, adoptedContext);
  }

  get $(): Readonly<T> {
    return this.toObject();
  }

  using<S extends ViewState<T> = T>(
    source: Source<S>,
    ...keys: Array<keyof S & keyof T>
  ): ViewModel<T> {
    const mapping: NameMapping<S, S> = Object.fromEntries(
      keys.map((k : keyof S) => [k, k]) as Array<Array<keyof S>>
    )
    return this.merge(new MappedSource<S, T>(source, mapping))
  }

  calculating<S extends ViewState>(
    source: Source<S>,
    mapping: NameMapping<T, S>
  ): ViewModel<T> {
    return this.merge(new MappedSource<S, T>(source, mapping))
  }

  renaming<S extends ViewState>(
    source: Source<S>,
    renaming: {[K in keyof Partial<T>]: keyof S}
  ): ViewModel<T> {
    return this.merge(new MappedSource<S, T>(source, renaming))
  }

  merge<S extends ViewState<T>>(
    source: Source<S>
  ): ViewModel<T> {
    if (source) {
      const entries =
      source
        .start((name: keyof S, value: any) => {
          console.log(
            "🪄 Merging effect",
            name,
            value,
            entries,
          );
          this.set(name, value);
        })
        .then((firstObservation: Partial<S>) => {
          console.log(
            "👀 ViewModel source observed:",
            firstObservation,
            entries,
          );
          const keys = Object.keys(firstObservation) as Array<keyof S>;
          keys.forEach((k: keyof S)=>
              this.set(k, firstObservation[k] as S[typeof k])
          );
        });
    }

    return this;
  }


  render(template: Template<[T]>): DocumentFragment {
    // console.log("📷 Rendering view, scope=", this.toObject());
    return template.render(this);
  }
}

export function createViewModel<T extends object>(
  init: Partial<T> = {}
): ViewModel<T> {
  return new ViewModel<T>(init);
}
