import { Signal } from "../effects";
import { Source, SourceEffect } from "../view";
import { Observer } from "./observer.ts";

export function fromService<T extends object>(
  target: HTMLElement,
  contextLabel: string
) {
  return new FromService<T>(target, contextLabel);
}

export class FromService<T extends object> implements Source<T> {
  private client: HTMLElement;
  private observer: Observer<T>;

  constructor(client: HTMLElement, contextLabel: string) {
    this.client = client;
    this.observer = new Observer<T>(contextLabel);
  }

  start(fn: SourceEffect<T>): Promise<T> {
    // console.log("Starting to observe service", this.observer);
    return this.observer.observe(this.client, (s: Signal<T, keyof T>) => {
      fn(s.property, s.value);
    });
  }
}
