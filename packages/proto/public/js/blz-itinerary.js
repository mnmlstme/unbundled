import { css, shadow, ViewModel, View } from "@un-bundled/unbundled";

export class BlzItineraryElement extends HTMLElement {
  viewModel = new ViewModel({
    itinerary: {
      destinations: []
    }
  });

  constructor() {
    super();
    shadow(this)
      .styles(BlzItineraryElement.styles)
      .replace(this.viewModel.render(this.view));

    this.addEventListener("click", (event) => {
      console.log("Click bubbled", event);
      const button = event.originalTarget;
      const id = button.id;
      switch (id) {
        case "extend-stay":
          const itinerary = this.viewModel.get("itinerary");
          const destinations = itinerary.destinations;
          const rome = destinations[2];
          let endDate = new Date(rome.endDate);
          endDate.setTime(endDate.getTime() + 24 * 60 * 60 * 1000);
          console.log("new end date:", endDate);
          const newItinerary = {
            ...itinerary,
            destinations: destinations.toSpliced(2, 1, {
              ...rome,
              endDate: endDate.toISOString().substr(0, 10)
            })
          };
          console.log("Setting itinerary:", newItinerary);
          this.viewModel.set("itinerary", newItinerary);
          return;
      }
    });
  }

  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue).then((data) => {
        console.log("Got itinerary:", data);
        console.log("Setting itinerary in viewmodel:", this.viewModel);
        this.viewModel.set("itinerary", data);
      });
    }
  }

  view = View.html`<dl>
      ${($) => View.map(this.destinationView, $.itinerary.destinations)}
    </dl>
    <button id="extend-stay">Extend Stay</button>`;

  destinationView = View.html`<div>
      <dt>${($) => `${$.startDate} to ${$.endDate}`}</dt>
      <dd>
        <blz-destination
          href=${($) => $.link}
          start-date=${($) => $.startDate}
          end-date=${($) => $.endDate}
        >
          ${($) => $.name}
        </blz-destination>
      </dd>
    </div>`;

  //
  hydrate(src) {
    return fetch(src)
      .then((response) => {
        if (response.status !== 200) throw `HTTP Status ${response.status}`;
        else return response.json();
      })
      .catch((error) => {
        console.log("Could not fetch:", error);
      });
  }

  static styles = css``;
}
