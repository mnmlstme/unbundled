import { css, html, shadow, ViewModel, createEffect } from "@un-/bundled";
import reset from "../styles/reset.css.js";
import headings from "../styles/headings.css.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends HTMLElement {
  static template = html`<template>
    <form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>
  </template>`;

  static styles = css`
    :host {
      display: contents;
    }
    form {
      display: contents;
    }
  `;

  viewModel = new ViewModel<LoginFormData>(
    {},
    fromInputs(
      {
        username: "",
        password: ""
      },
      this
    )
  );

  constructor() {
    super();
    shadow(this)
      .template(LoginFormElement.template)
      .styles(reset.styles, headings.styles, LoginFormElement.styles);

    this.shadowRoot?.addEventListener("submit", (ev: Event) =>
      this.submitLogin(ev as SubmitEvent, this.getAttribute("api"))
    );

    createEffect(() =>
      console.log(
        "Credentials:",
        this.viewModel.get("username"),
        this.viewModel.get("password")
      )
    );
  }

  submitLogin(event: SubmitEvent, endpoint) {
    event.preventDefault(); // [1]
    const data = this.viewModel.toObject(); // [3]
    const method = "POST"; // [4]
    const headers = {
      "Content-Type": "application/json" // [5]
    };
    const body = JSON.stringify(data); // [6]
    console.log("Posting login form:", endpoint, body, event);
    fetch(endpoint, { method, headers, body }) // [7]
      .then((res) => {
        if (res.status !== 200)
          throw `Form submission failed: Status ${res.status}`;
        return res.json(); // [8]
      })
      .then((json: unknown) => {
        const { token } = json as { token: string }; // [1]
        const customEvent = new CustomEvent("auth:message", {
          // [2]
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token }] // [3]
        });

        this.dispatchEvent(customEvent); // [4]
      });
  }
}

function fromInputs<P extends { [key: string]: string }>(
  init: P,
  target: HTMLElement
) {
  return (vm: ViewModel) => new ObservableInputs(target, init, vm);
}

class ObservableInputs<T> {
  inputs: { [key: string]: string };
  proxy: object;

  constructor(
    target: HTMLElement,
    init: { [key: string]: string },
    vm: ViewModel<T>
  ) {
    this.inputs = init;
    const handler = {
      get: function (target: { [key: string]: string }, property: string) {
        console.log(`Getting property ${property}`);
        return target[property];
      },
      set: function (
        target: { [key: string]: string },
        property: string,
        value: string
      ) {
        console.log(`Setting property ${property} to ${value}`);
        target[property] = value;
        vm.set(property, value);
        return true; // indicates that the setting has been done successfully
      }
    };
    this.proxy = new Proxy(this.inputs, handler);
    target.addEventListener("change", (event: Event) => {
      console.log("Change event received:", event, this.inputs);
      const input = event.target as HTMLInputElement;
      if (input) {
        const name = input.name as string;
        const value = input.value;

        if (name in this.inputs) this.proxy[name] = value;
        console.log("Set input:", name, this.inputs);
      }
    });
  }
}
