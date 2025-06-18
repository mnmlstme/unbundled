import { cloneTemplate } from "@un-bundled/unbundled";
import { createObservable } from "./effects.js";

export class ViewModel {
  constructor(init) {
    this.proxy = createObservable(init);
  }

  get(prop) {
    return this.proxy[prop];
  }

  set(prop, value) {
    this.proxy[prop] = value;
  }

  render(view, scope = this.proxy) {
    const effects = view.querySelectorAll("unbundled-effect");

    effects.forEach((node) => {
      if (node.effect) node.effect(scope, node);
      console.log("🧬 rendered with viewmodel", node);
    });

    return view;
  }

  map(view, scope = this.proxy) {
    return scope.map(v => {
      const clone = cloneTemplate(view);
      console.log("Cloned with effects:", view, clone);
      console.log("Effects in original:",
        view.querySelectorAll("unbundled-effect"));
      console.log("Effects in clone:",
        clone.querySelectorAll("unbundled-effect"));
      return this.render(clone, v);
    });
  }
}
