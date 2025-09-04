import {
  View,
  createView,
  createViewModel,
  fromAttributes,
  fromStore,
  html,
  shadow
} from "@un-bundled/unbundled";
import { TourIndex, Model } from "../model";
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
    html`<dt>${($) => $.name}</dt>
      <dd>${($) => $.startDate.toString()} to ${($) => $.endDate.toString()}</dd>
      <dd>${($) => $.entourage.join(", ")}</dd>
    </li>`
  );

  constructor() {
    super();
    shadow(this).replace(this.viewModel.render(this.view));
  }
}
