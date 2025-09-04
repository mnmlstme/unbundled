"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const context = require("./context-Y-FCGfAL.cjs");
const scope = require("./scope-DJo8ZA7T.cjs");
class DirectEffect {
  constructor(fn, ...scope2) {
    this.effectFn = () => fn(...scope2);
  }
  execute() {
    this.effectFn();
  }
}
exports.Context = context.Context;
exports.EffectsManager = context.EffectsManager;
exports.Scheduler = context.Scheduler;
exports.SignalEvent = context.SignalEvent;
exports.createContext = context.createContext;
exports.createEffect = context.createEffect;
exports.createScope = scope.createScope;
exports.exposeTuple = scope.exposeTuple;
exports.DirectEffect = DirectEffect;
