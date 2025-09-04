import {
  Store,
  View,
  createView,
  createView2,
  createViewModel,
  css,
  fromAttributes,
  fromStore,
  html,
  shadow
} from "@un-bundled/unbundled";
import { Model } from "../model";
import { Msg } from "../message";
import {
  Tour,
  Destination,
  Traveler,
  Transportation
} from "server/models";

interface TourViewModel {
  tourId: string;
  tour?: Tour;
  selectedDate?: Date;
}

interface TourViewAttributes {
  "tour-id": string;
}

export class TourViewElement extends HTMLElement {
  viewModel = createViewModel<TourViewModel>()
    .merge(fromAttributes<TourViewAttributes>(this), {
      tour: "tour-id"
    })
    .merge(fromStore<Model>(this), ["tour"]);

  view = createView<TourViewModel>(html`
    <section class="calendar">
      <h3>Calendar</h3>
      <calendar-widget
        start-date=${($) => $.tour?.startDate?.toString() || ""}
        end-date=${($) =>
          $.tour?.endDate?.toString() || ""}></calendar-widget>
    </section>
    <section class="itinerary">
      <h3>Itinerary</h3>
      <dl>
        ${($) =>
          View.map2(
            this.pairView,
            $.tour?.transportation || [],
            $.tour?.destinations || []
          )}
      </dl>
    </section>
    <section class="entourage">
      <h3>Entourage</h3>
      ${($) =>
        View.apply(this.entourageView, {
          travelers: $.tour?.entourage || []
        })}
    </section>
  `);

  pairView = createView2<Transportation, Destination>(html`
    ${($t, _) => View.apply(this.transportationView, $t)}
    ${(_, $d) => View.apply(this.destinationView, $d)}
  `);

  destinationView = createView<Destination>(html`
    <div>
      <dt>${($) => `${$.startDate} to ${$.endDate}`}</dt>
      <dd>
        <blz-destination
          start-date=${($) => $.startDate.toString()}
          end-date=${($) => $.endDate.toString()}>
          ${($) => $.name}
        </blz-destination>
      </dd>
    </div>
  `);

  transportationView = createView<Transportation>(html``);

  entourageView = createView<{ travelers: Array<Traveler> }>(
    html`
      <ul>
        ${($) =>
          View.map<Traveler>(
            html`
              <li>
                <a href=${($) => `/app/profile/${$.userid}`}>
                  ${($) =>
                    $.avatar
                      ? html`
                          <img src=${$.avatar} />
                        `
                      : ""}
                  <h4>${($) => $.name}</h4>
                </a>
              </li>
            `,
            $.travelers
          )}
      </ul>
    `
  );

  static styles = css``;

  constructor() {
    super();
    shadow(this)
      .styles(TourViewElement.styles)
      .replace(this.viewModel.render(this.view))
      .listen("calendar-widget/change", (ev: CustomEvent) => {
        const { dateString } = ev.detail as {
          dateString: string;
        };
        this.viewModel.set(
          "selectedDate",
          new Date(dateString)
        );
      });

    this.viewModel.createEffect(($) => {
      if ($.tourId)
        this.dispatch(["tour/request", { id: $.tourId }]);
    });
  }

  dispatch(msg: Msg) {
    Store.dispatch<Msg>(this, msg);
  }
}
