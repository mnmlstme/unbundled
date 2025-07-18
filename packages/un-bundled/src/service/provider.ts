import { Context } from "../view";
import { SignalReceiver } from "../effects";

export class Provider<T extends object> extends HTMLElement {
  readonly context: Context<T>;
  contextLabel: string;

  static DISCOVERY_EVENT = "un-provider:discover";
  static CHANGE_EVENT = "un-provider:change";

  static {
    document.addEventListener(Provider.DISCOVERY_EVENT, (event: Event) => {
      const [contextLabel, respondFn] = (event as CustomEvent).detail;
      console.log("No response from provider:", contextLabel);
      respondFn(null);
    });
  }

  constructor(init: T, label: string) {
    super();
    this.contextLabel = label;
    this.context = new Context<T>(init);
    this.context.setHost(this, Provider.CHANGE_EVENT);
    this.addEventListener(Provider.DISCOVERY_EVENT, (event: Event) => {
      const [contextLabel, respondFn] = (event as CustomEvent).detail;
      console.log(
        "Provider checking for context",
        this.contextLabel,
        contextLabel
      );
      if (contextLabel === this.contextLabel) {
        event.stopPropagation();
        respondFn(this);
      }
    });
    this.addEventListener(Provider.CHANGE_EVENT, (event: Event) => {
      console.log("Provider change event:", event);
    });
  }

  attach(observer: SignalReceiver<T>): T {
    this.addEventListener(Provider.CHANGE_EVENT, observer as EventListener);
    return this.context.toObject();
  }

  detach(observer: SignalReceiver<T>) {
    this.removeEventListener(Provider.CHANGE_EVENT, observer as EventListener);
  }
}

export function discover<T extends object>(
  observer: Element,
  contextLabel: string
): Promise<Provider<T>> {
  return new Promise<Provider<T>>((resolve, reject) => {
    const discoveryEvent = new CustomEvent(Provider.DISCOVERY_EVENT, {
      bubbles: true,
      composed: true,
      detail: [
        contextLabel,
        (provider: Provider<T>) => (provider ? resolve(provider) : reject())
      ]
    });

    observer.dispatchEvent(discoveryEvent);
  });
}
