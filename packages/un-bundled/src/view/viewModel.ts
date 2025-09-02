import { Context } from "../effects/index.ts";
import { Source } from "./source.ts";
import { Template } from "../html";

export type NameMapping<T extends object, S extends object> = {
  [K in keyof Partial<T>]: keyof Partial<S> | ((s: S) => any);
};

function mapEntries<T extends object, S extends object>(
  mapping: NameMapping<T, S>
): Array<[keyof T, keyof S]> {
  return Object.entries(mapping).map(([k, v]) => [
    k as keyof T,
    v as keyof S
  ]);
}

export class ViewModel<T extends object> extends Context<T> {
  constructor(init: Partial<T>, adoptedContext?: Context<T>) {
    super(init as T, adoptedContext);
  }

  get $() {
    return this.toObject();
  }

  merge<S extends object>(
    source: Source<S>,
    mapping:
      | NameMapping<T, S>
      | Array<NameMapping<T, S> | (keyof T & keyof S)>
  ): ViewModel<T> {
    const entries: Array<[keyof T, keyof S]> = !Array.isArray(
      mapping
    )
      ? mapEntries<T, S>(mapping)
      : mapping
          .map((m) =>
            typeof m === "string"
              ? ([[m as keyof T, m as keyof S]] satisfies Array<
                  [keyof T, keyof S]
                >)
              : mapEntries<T, S>(m as NameMapping<T, S>)
          )
          .flat();

    // console.log("Merge entries:", entries, mapping, source);

    if (source) {
      source
        .start((name: keyof S, value: any) => {
          // console.log("Merging effect", name, value, entries, mapping);
          const pair = entries.find(([_, s]) => s === name);
          if (pair) this.set(pair[0], value);
        })
        .then((firstObservation: Partial<S>) => {
          // console.log("ViewModel source observed:", firstObservation, entries, mapping);
          entries.forEach(([t, s]) =>
            this.set(t, firstObservation[s])
          );
        });
    }

    return this;
  }

  render(template: Template<[T]>): DocumentFragment {
    // console.log("Rendering view, scope=", this.toObject());
    return template(this);
  }
}

export function createViewModel<T extends object>(
  init?: T
): ViewModel<T> {
  return new ViewModel<T>(init || {});
}
