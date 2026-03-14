import { C, E, S, a, c, b } from "./context-Xq2PPHJ1.js";
import { c as c2, e } from "./scope-Ch2w8axL.js";
class DirectEffect {
  constructor(fn, ...scope) {
    this.effectFn = () => fn(...scope);
  }
  execute() {
    this.effectFn();
  }
}
export {
  C as Context,
  DirectEffect,
  E as EffectsManager,
  S as Scheduler,
  a as SignalEvent,
  c as createContext,
  b as createEffect,
  c2 as createScope,
  e as exposeTuple
};
