export type Effector<T extends object> = (scope: T) => void;

export interface Effect<T extends object> {
  execute(scope: T): void;
}

const $context: Effect<object>[] = [];

function effectInContext(): Effect<object> | undefined {
  const len = $context.length;
  return len ? $context[len - 1] : undefined;
}

export function createEffect<T extends object>(
  fn: Effector<T>,
  initialScope: T
) {
  const effect = {
    execute(context: T) {
      $context.push(effect);
      fn(context);
      $context.pop();
    }
  };

  effect.execute(initialScope);
}

export class EffectsManager<T extends object> {
  signals: Map<string, Set<Effect<T>>> = new Map();

  subscribe(key: string): void {
    const effect = effectInContext();
    if (effect) {
      let signal = this.signals.get(key);
      if (!signal) this.signals.set(key, (signal = new Set()));
      signal.add(effect);
    }
  }

  runEffects(key: string, scope: T): void {
    const signal = this.signals.get(key);
    if (signal) {
      for (const effect of signal) {
        effect.execute(scope);
      }
    }
  }
}
