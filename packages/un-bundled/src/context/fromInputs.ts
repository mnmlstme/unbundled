import { Observer, ObserverEffect } from "./observer.ts";

export function fromInputs<T extends object>(subject: HTMLElement) {
  return new FromInputs<T>(subject);
}

class FromInputs<T extends object> implements Observer<T> {
  effectFn?: ObserverEffect<T>;

  constructor(subject: HTMLElement) {
    subject.addEventListener("change", (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input && this.effectFn) {
        const name = input.name as keyof T;
        const value = input.value;
        this.effectFn(name, value);
      }
    });
  }

  setEffect(fn: ObserverEffect<T>): void {
    this.effectFn = fn;
  }
}
