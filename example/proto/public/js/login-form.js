import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromInputs } from "@unbndl/view";
import reset from "./reset.css.js";

export class LoginFormElement extends HTMLElement {
  viewModel = createViewModel({
    username: "",
    password: ""
  })
    .with(fromInputs(shadow(this).root),
      "username", "password"
  );

  view = html`<form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`;

  constructor() {
    super();
    shadow(this)
      .styles(reset.styles, LoginFormElement.styles)
      .replace(this.viewModel.render(this.view));

    this.shadowRoot?.addEventListener("submit", (ev) =>
      this.submitLogin(ev, this.getAttribute("api") || "#")
    );
  }

  submitLogin(event, endpoint) {
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
      .then((json) => {
        const { token } = json; // [1]
        const customEvent = new CustomEvent("auth:message", {
          // [2]
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: "/" }] // [3]
        });

        this.dispatchEvent(customEvent); // [4]
      });
  }

  static styles = css`
    :host {
      display: contents;
    }
    form {
      display: contents;
    }
  `;

}
