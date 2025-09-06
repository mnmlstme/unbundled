import {
  Store,
  View,
  createView,
  createViewModel,
  fromAttributes,
  fromStore,
  html,
  shadow
} from "@un-bundled/unbundled";
import { TourIndex, Model } from "../model";
import { Msg } from "../message";
import { TourBrief } from "server/models";

type HomeViewAttributes = { "user-id"?: string };

interface HomeViewModel {
  userid?: string;
  tourIndex?: TourIndex;
}

export class HomeViewElement extends HTMLElement {
  viewModel = createViewModel<HomeViewModel>()
    .merge(fromAttributes<HomeViewAttributes>(this), {
      userid: "user-id"
    })
    .merge(fromStore<Model>(this), ["tourIndex"]);

  view = createView<HomeViewModel>(html`
    <dl>
      ${($) =>
        View.map(this.viewTour, $.tourIndex?.tours || [])}
    </dl>
  `);

  viewTour = createView<TourBrief>(
    html`
      <dt>
        <a href=${($) => `/app/tour/${$.id}`}>${($) => $.name}</a>
      </dt>
      <dd>${($) => $.startDate.toString()} to ${($) => $.endDate.toString()}</dd>
      <dd>
        <ul>
          ${($) =>
            View.map<{ userid: string }>(
              this.travelerView,
              $.entourage
            )}
        </ul>
      </dd>
    </li>`
  );

  travelerView = createView<{ userid: string }>(html`
    <li>
      <a href=${($) => `/app/profile/${$.userid}`}>
        ${($) => $.userid}
      </a>
    </li>
  `);

  dispatch(msg: Msg) {
    Store.dispatch<Msg>(this, msg);
  }

  constructor() {
    super();
    shadow(this).replace(this.viewModel.render(this.view));

    this.viewModel.createEffect(($) => {
      if ($.userid)
        this.dispatch([
          "tourIndex/request",
          { userid: $.userid }
        ]);
    });
  }
}
