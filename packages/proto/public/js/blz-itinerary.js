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
      .styles(BlzItineraryElement.styles)
      .replace(BlzItineraryElement.render(this.$.itinerary));

    this.addEventListener("observable:change", (event) => {
      const [prop, oldValue, newValue] = event.detail;
      switch (prop) {
        case "itinerary":
          console.log("⚡️ViewModel[itinerary] changed!", newValue, oldValue);
          BlzItineraryElement.render(newValue, oldValue, this.shadowRoot);
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
          let endDate = new Date(rome.endDate)
          endDate.setTime(endDate.getTime() + 24 * 60 * 60 * 1000);
          console.log("new end date:", endDate);
          const newItinerary = {
            ...itinerary,
            destinations: destinations.toSpliced(
              2, 1,
              { ...rome, endDate: endDate.toISOString().substr(0, 10) }
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

  static render(itinerary, previous = null, root = null  ) {
    const destinations = itinerary?.destinations || [];

    if (!previous) {
      // initial render: create DOMFragment
      console.log("initial render");
      return  html`<dl>
        ${destinations.map(renderDestination)}
      </dl>
      <button onclick="console.log('Click')" id="extend-stay">Extend Stay</button>
    `;
    }

    // There is already a view, we need to update it.

    const parent = root.firstElementChild;
    const children = parent.children;
    console.log("re-render DL children:", Array.from(children), destinations, previous.destinations);

    destinations.forEach((d, i) => {
      const changed = d !== previous.destinations[i];
      if ( changed ) {
        const view = renderDestination(d);
        if (i < children.length)
          children[i].replaceWith(view);
        else
          parent.append(view);
     }
    });

    function renderDestination(dest) {
        const {name, link, startDate, endDate, featuredImage} = dest;

      console.log("🌆 (re) Rendering destination:", name);
        return html`
            <div>
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
            </div>
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
