import { DirectEffect, Effector, Signal, SignalEvent } from "../effects";
import { Provider, discover } from "./provider";

export class Observer<T extends object> {
  private contextLabel: string;
  private provider?: Provider<T>;
  private observed?: T;

  constructor(contextLabel: string) {
    this.contextLabel = contextLabel;
  }

  observe(from: Element, fn: Effector<Signal<T, keyof T>>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.provider) {
        resolve(this.attachObserver(fn));
      } else {
        // console.log("Initiating discovery for provider", this.contextLabel);
        discover<T>(from, this.contextLabel)
          .then((provider: Provider<T>) => {
            // console.log("Observer found provider", this.contextLabel, provider);
            this.provider = provider;
            resolve(this.attachObserver(fn));
          })
          .catch((err) => reject(err));
      }
    });
  }

  private attachObserver(fn: Effector<Signal<T, keyof T>>): T {
    const effect = new DirectEffect<Signal<T, keyof T>>(fn);
    const init = this.provider!!.attach((ev: SignalEvent<T, keyof T>) => {
      const { property, value } = ev.detail;
      // console.log("Signal received:", property, value);
      if (this.observed) {
        this.observed[property] = value;
        effect.execute({ property, value });
      }
    });
    // console.log("Initial observation:", init);
    this.observed = init;
    return init;
  }
}
