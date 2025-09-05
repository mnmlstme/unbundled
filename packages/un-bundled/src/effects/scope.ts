import { Context } from "./context";
import { EffectArgs } from "./effect";

export type Scope<TT extends EffectArgs> = {
  [Index in keyof TT]: TT[Index] extends object
    ? Context<TT[Index]>
    : object;
};

export function exposeTuple<TT extends EffectArgs>(
  scope: Scope<TT>
): TT {
  return scope.map((cx) =>
    cx instanceof Context ? cx.toObject() : cx
  ) as TT;
}

export function createScope<TT extends EffectArgs>(
  tuple: TT
): Scope<TT> {
  return tuple.map((a) =>
    typeof a === "undefined" ? null : new Context(a)
  ) as Scope<TT>;
}
