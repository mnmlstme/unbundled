import { css, define, fx, html, shadow, ViewModel } from "@un-/bundled";
import headings from "../styles/headings.css";
import reset from "../styles/reset.css";

interface HeaderData {
  loggedIn: boolean;
  userid?: string;
  token?: string;
}

export class HeaderElement extends HTMLElement {
  viewModel = new ViewModel<HeaderData>({
    loggedIn: false
  });

  view = html` <header>
    <h1>Blazing Travels</h1>
    <p>Hello, ${fx(($) => $.userid || "traveler")}</p>
    ${fx(
      ($) =>
        html`<nav class=${$.loggedIn ? "logged-in" : "logged-out"}>
          <menu>
            <li class="when-signed-in">
              <a id="signout">Sign Out</a>
            </li>
            <li class="when-signed-out">
              <a>Sign In</a>
            </li>
          </menu>
        </nav>`
    )}
  </header>`;

  static styles = css`
    :host {
      display: contents;
    }
    header {
      display: flex;
      grid-column: start / end;
      flex-wrap: wrap;
      align-items: bottom;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--color-background-header);
      color: var(--color-text-inverted);
    }
    header ~ * {
      margin: var(--size-spacing-medium);
    }
    header p {
      --color-link: var(--color-link-inverted);
    }
    nav {
      display: flex;
      flex-direction: column;
      flex-basis: max-content;
      align-items: end;
    }
    a[slot="actuator"] {
      color: var(--color-link-inverted);
      cursor: pointer;
    }
    #userid:empty::before {
      content: "traveler";
    }
    menu a {
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }
    nav.logged-out .when-signed-in,
    nav.logged-in .when-signed-out {
      display: none;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .styles(reset.styles, headings.styles, HeaderElement.styles)
      .replace(this.viewModel.render(this.view));
  }
}
