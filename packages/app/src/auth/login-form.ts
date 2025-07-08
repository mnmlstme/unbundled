import { css, html, shadow, ViewModel, fromInputs } from "@un-/bundled";
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
    fromInputs<LoginFormData>(this, {
      username: "",
      password: ""
    })
  );

  constructor() {
    super();
    shadow(this)
      .template(LoginFormElement.template)
      .styles(reset.styles, headings.styles, LoginFormElement.styles);

    this.shadowRoot?.addEventListener("submit", (ev: Event) =>
      this.submitLogin(ev as SubmitEvent, this.getAttribute("api") || "#")
    );

    this.viewModel.createEffect(() =>
      console.log(
        "Credentials:",
        this.viewModel.get("username"),
        this.viewModel.get("password")
      )
    );
  }

  submitLogin(event: SubmitEvent, endpoint: string) {
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
