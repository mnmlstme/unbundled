import { Effect } from "./effect.ts";
import { SignalEvent } from "./signal.ts";

export class EffectsManager<T extends object> {
  private signals: Map<keyof T, Set<Effect<T>>> = new Map();
  private running: Effect<T>[] = [];
  private host?: EventTarget;
  private eventType = "un-effect:change";

  isRunning(): boolean {
    return this.running.length > 0;
  }

  start(effect: Effect<T>): void {
    console.log("Starting manager for effect", effect);
    this.running.push(effect);
  }

  stop(): void {
    console.log("Stopping manager for effect");
    this.running.pop();
  }

  current(): Effect<T> | undefined {
    const len = this.running.length;
    return len ? this.running[len - 1] : undefined;
  }

  subscribe(key: keyof T): void {
    const current = this.current();
    if (current) {
      console.log("Subscribing to signal", key);
      let signal = this.signals.get(key);
      if (!signal) this.signals.set(key, (signal = new Set()));
      signal.add(current);
    }
  }

  runEffects(key: keyof T, scope: T): void {
    const signal = this.signals.get(key);
    console.log("Running effects for signal", key, signal);
    if (signal) {
      for (const effect of signal) {
        effect.execute(scope);
      }
    }
    if (this.host) {
      const evt = new SignalEvent(this.eventType, {
        property: key,
        value: scope[key]
      });
      this.host.dispatchEvent(evt);
    }
  }

  setHost(host: EventTarget, eventType?: string) {
    this.host = host;
    if (eventType) this.eventType = eventType;
  }
}
