import { css, html, shadow, ViewModel } from "@un-/bundled";
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

  inputs = new ObservableInputs(this, {
    username: "",
    password: ""
  });

  viewModel = new ViewModel<LoginFormData>(this.inputs);

  constructor() {
    super();
    shadow(this)
      .template(LoginFormElement.template)
      .styles(reset.styles, headings.styles, LoginFormElement.styles);

    this.shadowRoot?.addEventListener("submit", (ev: Event) =>
      this.submitLogin(ev as SubmitEvent, this.getAttribute("api"))
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

function $input(target: HTMLElement, name: string) {
  return new ViewModelEffect((viewModel) => viewModel.set(name));
}

class ObservableInputs {
  inputs: { [key: string]: string };

  constructor(target: HTMLElement, init: { [key: string]: string }) {
    this.inputs = init;
    target.addEventListener("change", (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input) {
        const name = input.name as string;
        const value = input.value;

        if (name in this.inputs) this.inputs[name] = value;
      }
    });
  }
}
