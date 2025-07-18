"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const context = require("./context-Bd2U9W3u.cjs");
class DirectEffect {
  constructor(fn) {
    this.effectFn = fn;
  }
  execute(scope) {
    this.effectFn(scope);
  }
}
exports.Context = context.Context;
exports.EffectsManager = context.EffectsManager;
exports.SignalEvent = context.SignalEvent;
exports.createContext = context.createContext;
exports.DirectEffect = DirectEffect;
