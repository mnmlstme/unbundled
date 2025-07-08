import { css, shadow, View, createViewModel } from "@un-bundled/unbundled";

export class BlzDestinationElement extends HTMLElement {
  viewModel = createViewModel({
    startDate: "2000-01-01",
    endDate: "2000-01-01",
    featuredImage: "none",
    link: "#"
  });

  view = View.html`
    <section>
      <header>
        <h2>
          <a href=${($) => $.link}>
            <slot>Unnamed Destination</slot>
          </a>
        </h2>
        <p>${($) => nightsBetween($.startDate, $.endDate)} nights</p>
      </header>
      <slot name="highlights"></slot>
    </section>
  `;

  static styles = css`
    :host {
      --img-src: none;
    }
    section {
      aspect-ratio: 16/9;
      background-image: var(--img-src);
      background-size: cover;
    }
  `;

  constructor() {
    super();

    shadow(this)
      .styles(BlzDestinationElement.styles)
      .replace(this.viewModel.render(this.view));
  }

  static observedAttributes = ["img-src", "href", "start-date", "end-date"];

  attributeChangedCallback(name, _, newValue) {
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
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
}
