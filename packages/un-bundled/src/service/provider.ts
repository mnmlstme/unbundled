import { Context } from "../context";

export class Provider<T extends object> extends HTMLElement {
  readonly context: Context<T>;

  static CONTEXT_CHANGE_EVENT = `un-provider:change`;

  constructor(init: T) {
    super();
    console.log("Constructing context provider", this);
    this.context = new Context<T>(init, this);
    this.style.display = "contents";
  }

  attach(observer: EventListener) {
    this.addEventListener(Provider.CONTEXT_CHANGE_EVENT, observer);
    return observer;
  }

  detach(observer: EventListener) {
    this.removeEventListener(Provider.CONTEXT_CHANGE_EVENT, observer);
  }
}

export function whenProviderReady<T extends object>(
  consumer: Element,
  contextLabel: string
) {
  const provider = closestProvider(contextLabel, consumer) as Provider<T>;

  return new Promise<Provider<T>>((resolve, reject) => {
    if (provider) {
      const name = provider.localName;
      customElements.whenDefined(name).then(() => resolve(provider));
    } else {
      reject({
        context: contextLabel,
        reason: `No provider for this context "${contextLabel}:`
      });
    }
  });
}

function closestProvider(
  contextLabel: string,
  el: Element
): Element | undefined {
  const selector = `[provides="${contextLabel}"]`;

  if (!el || el === document.getRootNode()) return undefined;

  const closest = el.closest(selector);

  if (closest) return closest;

  const root = el.getRootNode();

  if (root instanceof ShadowRoot)
    return closestProvider(contextLabel, root.host);

  return undefined;
}
