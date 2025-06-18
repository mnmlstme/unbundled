import { css, html, shadow } from "@un-bundled/unbundled";

export class BlzDestinationElement extends HTMLElement {
  static template = html`
    <template>
      <section>
        <header>
          <h2>
            <a>
              <slot>Untitled Destination</slot>
            </a>
          </h2>
          <p id="nights"></p>
        </header>
        <slot name="highlights"></slot>
      </section>
    </template>
  `;

  constructor() {
    super();

    shadow(this)
      .template(BlzDestinationElement.template)
      .styles(BlzDestinationElement.styles);
  }

  static observedAttributes = ["img-src", "href", "start-date", "end-date"];

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "href":
        this._updateHref(newValue);
        break
      case "img-src":
        this._updateImgSrc(newValue);
        break;
      case "start-date":
      case "end-date":
        this._updateNights(
          this.getAttribute("start-date"),
          this.getAttribute("end-date")
        );
    }
  }

  _updateHref(href) {
    const a = this.shadowRoot.querySelector("a");
    a.setAttribute("href", href);
  }

  _updateImgSrc(imgSrc) {
    this.style.setProperty("--img-src", `url(${imgSrc})`);
  }

  _updateNights(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    const p = this.shadowRoot.getElementById("nights");
    p.textContent = `${nights} nights`
  }

  static styles = css`
    :host {
      --img-src: none;
    }
    section {
      aspect-ratio: 16/9;
      background-image: var(--img-src);
      background-size: cover;
    }
  `
}
