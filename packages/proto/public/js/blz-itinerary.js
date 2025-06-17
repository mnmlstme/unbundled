import { css, html, shadow } from "@un-bundled/unbundled";
import { viewModel } from "./viewModel.js";

export class BlzItineraryElement extends HTMLElement {

  $ = viewModel(this, {
    itinerary: {
      destinations: []
    }
  });

  constructor() {
    super();
    shadow(this)
      .styles(BlzItineraryElement.styles);

    this.addEventListener("observable:change", (event) => {
      const [prop, oldValue, newValue] = event.detail;
      switch (prop) {
        case "itinerary":
          console.log("⚡️ViewModel[itinerary] changed!", this.$.itinerary);
          const view = BlzItineraryElement.render(this.$.itinerary)
          shadow(this).replace(view);
          return;
      }
    });

    this.addEventListener("click", (event) => {
      console.log("Click bubbled", event);
      const button = event.originalTarget;
      const id = button.id;
      switch (id) {
        case "extend-stay":
          const itinerary = this.$.itinerary;
          const destinations = itinerary.destinations;
          const rome = destinations[2];
          const newItinerary = {
            ...itinerary,
            destinations: destinations.toSpliced(
              2, 1,
              { ...rome, endDate: "2024-10-30" }
            )
          };
          console.log("Setting itinerary:", newItinerary);
          this.$.itinerary = newItinerary;
          return;
      }
    })
  }

  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue)
        .then((data) => {
          this.$.itinerary = data;
         });
    }
  }

  static render(itinerary) {
    const destinations = itinerary?.destinations || [];
    return html`<dl>
        ${destinations.map(renderDestination)}
      </dl>
      <button onclick="console.log('Click')" id="extend-stay">Extend Stay</button>
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
