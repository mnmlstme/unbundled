import { ViewState } from "./viewModel.ts";

export type SourceEffect<S extends ViewState> =
  (name: keyof S, value: any) => void;

export interface Source<S extends ViewState> {
   start(fn: SourceEffect<S>): Promise<Partial<S>>;
}

export class MappedSource<S extends ViewState, T extends ViewState>
  implements Source<T> {

  private origin: Source<S>;
  private inverse: {[K in keyof S]: keyof T };

  constructor( source: Source<S>, mapping: NameMapping<T, S> ) {
    this.origin = source;
    const entries = mapEntries(mapping)
      .map(([t, s]) => [s, t]);
    this.inverse = Object.fromEntries(entries);
  }

  mapObservation(source: Partial<S>): Partial<T> {
    const entries = Object.entries(source) as Array<[keyof S, any]>;

    return Object.fromEntries(
      entries.map(([s, v]) => {
        const t = this.inverse[s]
        return [t, v]
      })
      .filter(pair => pair.length > 0)
    );
  }

  start(fn: SourceEffect<T>): Promise<Partial<T>> {
    const sfn: SourceEffect<S> = (s: keyof S, value) => {
      const t = this.inverse[s]
      fn(t, value)
    }
    return this.origin.start(sfn)
      .then((obs: Partial<S>) => this.mapObservation(obs));
  }

}

export type NameMapping<T extends object, S extends object> = {
  [K in keyof Partial<T>]:
    keyof S | ((s: S) => Required<T>[K]);
};

function mapEntries<T extends object, S extends object>(
  mapping: NameMapping<T, S>
): Array<[keyof T, keyof S]> {
  return Object.entries(mapping).map(([k, v]) => [
    k as keyof T,
    v as keyof S
  ]);
}