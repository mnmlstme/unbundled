import { C, E, S, b, c, a } from "./context-DxrrEInf.js";
import { c as c2, e } from "./scope-DMTZ_lvu.js";
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
  b as SignalEvent,
  c as createContext,
  a as createEffect,
  c2 as createScope,
  e as exposeTuple
};
