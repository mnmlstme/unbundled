const $context = [];
function effectInContext() {
  const len = $context.length;
  return len ? $context[len - 1] : void 0;
}
function createEffect(fn, initialScope) {
  const effect = {
    execute(context) {
      $context.push(effect);
      fn(context);
      $context.pop();
    }
  };
  effect.execute(initialScope);
}
class EffectsManager {
  constructor() {
    this.signals = /* @__PURE__ */ new Map();
  }
  subscribe(key) {
    const effect = effectInContext();
    if (effect) {
      let signal = this.signals.get(key);
      if (!signal) this.signals.set(key, signal = /* @__PURE__ */ new Set());
      signal.add(effect);
    }
  }
  runEffects(key, scope) {
    const signal = this.signals.get(key);
    if (signal) {
      for (const effect of signal) {
        effect.execute(scope);
      }
    }
  }
}
export {
  EffectsManager,
  createEffect
};
