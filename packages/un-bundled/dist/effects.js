import { C, E, S, c } from "./context-BGcAQqoc.js";
class DirectEffect {
  constructor(fn) {
    this.effectFn = fn;
  }
  execute(scope) {
    this.effectFn(scope);
  }
}
export {
  C as Context,
  DirectEffect,
  E as EffectsManager,
  S as SignalEvent,
  c as createContext
};
