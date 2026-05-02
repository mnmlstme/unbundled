import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";

export class BlzDestinationElement extends HTMLElement {
  viewModel = createViewModel({
    startDate: "2000-01-01",
    endDate: "2000-01-01",
    featuredImage: "none",
    link: "#"
  });

  view = html`
    <section
      style=${($) => `--img-src: url(${$.featuredImage})`}
    >
      <header>
        <h2>
          <a href=${($) => $.link}>
            <slot>Unnamed Destination</slot>
          </a>
        </h2>
        <p>${($) => {
            console.log("$=", $);
            return nightsBetween($.startDate, $.endDate)
        }
        } nights</p>
      </header>
      <slot name="highlights"></slot>
    </section>
  `;

  static styles = css`
    :host {
      --img-src: none;
      --color-text: var(--color-text-inverted);
      --color-link: var(--color-link-inverted);
    }
    * {
        margin: 0;
        box-sizing: border-box;
    }
    section {
      aspect-ratio: 16/9;
      background-image: var(--img-src);
      background-size: cover;
      padding: var(--size-spacing-medium);
      color: var(--color-text);
      text-shadow: 1px 1px 2px rgb(0 0 0 / 20%);
    }
    header {
      font-family: var(--font-display);
      font-style: var(--style-font-title);
    }
    a[href] {
      color: var(--color-link);
    }
  `;

  constructor() {
    super();

    shadow(this)
      .styles(BlzDestinationElement.styles)
      .replace(this.viewModel.render(this.view));
  }

  static observedAttributes = [
    "img-src",
    "href",
    "start-date",
    "end-date"
  ];

  attributeChangedCallback(name, _, newValue) {
    console.log("ACC", name, newValue);
    switch (name) {
      case "href":
        this.viewModel.set("link", newValue);
        break;
      case "img-src":
        this.viewModel.set("featuredImage", newValue);
        break;
      case "start-date":
        this.viewModel.set("startDate", newValue);
        break;
      case "end-date":
        this.viewModel.set("endDate", newValue);
        break;
    }
  }
}

function nightsBetween(startDate, endDate) {
  console.log("Start/endDate:", startDate, endDate);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor(
    (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
  );
}
