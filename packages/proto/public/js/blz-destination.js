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
          <p></p>
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

  static observedAttributes = ["img-src", "href"];

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "href":
        this._updateHref(newValue);
        break
      case "img-src":
        this._updateImgSrc(newValue);
        break;
    }
  }

  _updateHref(href) {
    const a = this.shadowRoot.querySelector("a");
    a.setAttribute("href", href);
  }

  _updateImgSrc(imgSrc) {
    this.style.setProperty("--img-src", `url(${imgSrc})`);
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
