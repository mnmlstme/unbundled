import {
  css,
  View,
  createViewModel,
  fromAttributes,
  fromAuth,
  shadow
} from "@un-/bundled";
import reset from "../styles/reset.css.js";
import headings from "../styles/headings.css.js";
import { Profile } from "server/models";

interface ProfileViewData {
  userid?: string;
  profile?: Profile;
  token?: string;
}

export class ProfileViewElement extends HTMLElement {
  viewModel = createViewModel<ProfileViewData>()
    .merge(
      {
        token: undefined
      },
      fromAuth(this)
    )
    .merge(
      {
        userid: undefined
      },
      fromAttributes(this)
    );

  view = this.viewModel.html`
      <section>
        ${($) => View.apply<Profile>(this.mainView, $.profile)}
      </section>`;

  mainView = View.html<Profile>`
      <img src=${($) => $.avatar} alt=${($) => $.name} />
      <h1>${($) => $.name}</h1>
      <dl>
        <dt>Username</dt>
        <dd>${($) => $.userid}</dd>
        <dt>Nickname</dt>
        <dd>${($) => $.nickname}</dd>
        <dt>Home City</dt>
        <dd>${($) => $.home}</dd>
        <dt>Airports</dt>
        <dd>${($) => $.airports.join(", ")}</dd>
        <dt>Favorite Color</dt>
        <dd>
          <span
            class="swatch"
            style=${($) => `background: ${$.color}`}></span>
          <span>${($) => $.color}</span>
        </dd>
      </dl>
  `;

  constructor() {
    super();
    shadow(this)
      .styles(reset.styles, headings.styles, ProfileViewElement.styles)
      .replace(this.view);
    this.viewModel.createEffect(($) => {
      console.log("Hydrate maybe?", $.userid, $.token);
      if ($.userid && $.token) this.hydrate($.userid, $.token);
    });
  }

  static styles = css`
    :host {
      display: contents;
      grid-column: 2/-2;
      display: grid;
      grid-template-columns: subgrid;
    }
    section {
      display: grid;
      grid-template-columns: subgrid;
      gap: inherit;
      gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
      align-items: end;
      grid-column: 1 / -1;
    }
    h1 {
      grid-row: 4;
      grid-column: auto / span 2;
    }
    img {
      display: block;
      grid-column: auto / span 2;
      grid-row: 1 / span 4;
    }
    .swatch {
      display: inline-block;
      width: 2em;
      aspect-ratio: 1;
      vertical-align: middle;
    }
    dl {
      display: grid;
      grid-column: 1 / -1;
      grid-row: 5 / auto;
      grid-template-columns: subgrid;
      align-items: baseline;
    }
    dt {
      grid-column: 1 / span 2;
      color: var(--color-accent);
      font-family: var(--font-family-display);
    }
    dd {
      grid-column: 3 / -1;
    }
    mu-form {
      display: contents;
    }
    input {
      margin: var(--size-spacing-medium) 0;
      font: inherit;
    }
  `;

  hydrate(userid: string, token: string) {
    return fetch(`/api/profiles/${userid}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response: Response) => {
        if (response.status !== 200) throw `HTTP Status: ${response.status}`;
        return response.json();
      })
      .then((json: object) => {
        this.viewModel.set("profile", json as Profile);
      })
      .catch((error) => {
        console.log("Could not fetch:", error);
      });
  }
}
