import { Source, SourceEffect } from "./source.ts";

export function fromAttributes<T extends object>(subject: Element) {
  return new FromAttributes<T>(subject);
}

class FromAttributes<T extends object> implements Source<T> {
  subject: Element;

  constructor(subject: Element) {
    this.subject = subject;
  }

  start(fn: SourceEffect<T>): Promise<T> {
    const observer = new MutationObserver(effectChanges);
    const element = this.subject;
    observer.observe(element, { attributes: true });
    // console.log("Observing attributes of", element);

    return new Promise<T>((resolve, _reject) => {
      const init: { [name: string]: string } = {};
      const attributes = element.attributes;
      for (const attr of attributes) {
        init[attr.name] = attr.value;
      }
      resolve(init as T);
    });

    function effectChanges(mutations: Array<MutationRecord>) {
      mutations.forEach((mut) => {
        const name = mut.attributeName as keyof T;
        const value = element.getAttribute(name as string);
        // console.log("Attribute Mutation!", name, value);
        fn(name, value);
      });
    }
  }
}
