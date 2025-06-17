import { css, html, shadow } from "@un-bundled/unbundled";

export class BlzItineraryElement extends HTMLElement {

  constructor() {
    super();
    shadow(this).styles(BlzItineraryElement.styles);
  }

  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue)
        .then((data) => {
          const view = BlzItineraryElement.render(data)
          shadow(this).replace(view);
        });
    }
  }

  static render(data) {
    const destinations = data?.destinations || [];
    return html`<dl>
        ${destinations.map(renderDestination)}
      </dl>
    `;

    function renderDestination(dest) {
        const {name, link, startDate, endDate, featuredImage} = dest;

        return html`
        . <dt>${dest.startDate} to ${dest.endDate}</dt>
          <dd>
          <blz-destination
            start-date="${startDate}"
            end-date="${endDate}"
            href="${link}"
            img-src="${featuredImage}"
          >
            ${name}
          </blz-destination>
          </dd>
        `;
    }
  }

  hydrate(src) {
    return fetch(src)
      .then((response) => {
        if (response.status !== 200)
          throw `HTTP Status ${response.status}`;
        else
          return response.json();
      })
      .catch((error) => {
        console.log("Could not fetch:", error)
      });
  }

  static styles = css`

    `;
}
