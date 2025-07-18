import { Source, SourceEffect } from "./source.ts";

export function fromInputs<T extends object>(subject: Node) {
  return new FromInputs<T>(subject);
}

class FromInputs<T extends object> implements Source<T> {
  subject: Node;

  constructor(subject: Node) {
    this.subject = subject;
  }

  start(fn: SourceEffect<T>): Promise<T> {
    this.subject.addEventListener("change", (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input) {
        const name = input.name as keyof T;
        const value = input.value;
        fn(name, value);
      }
    });

    return new Promise<T>((_resolve, _reject) => {
      // use FormData?
    });
  }
}
