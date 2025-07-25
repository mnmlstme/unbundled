import {
  css,
  define,
  View,
  createView,
  createViewModel,
  fromAttributes,
  fromAuth,
  shadow
} from "@un-/bundled";
import reset from "../styles/reset.css.js";
import headings from "../styles/headings.css.js";
import { Profile } from "server/models";
import { InputArrayElement } from "./input-array.js";

type ProfileMode = "view" | "edit" | "new";
interface ProfileViewData {
  mode: ProfileMode;
  userid?: string;
  profile?: Profile;
  username?: string;
  token?: string;
  _avatar?: string;
}

const html = View.html;

export class ProfileViewElement extends HTMLElement {
  static uses = define({
    "input-array": InputArrayElement
  });

  viewModel = createViewModel<ProfileViewData>({
    mode: "view" as ProfileMode
  })
    .merge(
      {
        userid: ""
      },
      fromAttributes(this)
    )
    .merge(
      {
        token: "",
        username: ""
      },
      fromAuth(this)
    );

  constructor() {
    super();
    shadow(this)
      .styles(reset.styles, headings.styles, ProfileViewElement.styles)
      .replace(this.viewModel.render(this.view))
      .delegate("#edit-mode", {
        click: () => this.viewModel.set("mode", "edit")
      })
      .delegate("#cancel", {
        click: () => this.viewModel.set("mode", "view")
      })
      .delegate('input[name="avatar"]', {
        change: (e: InputEvent) => {
          const target = e.target as HTMLInputElement;
          const files = target.files;
          if (files && files.length) this.readAvatarBase64(files);
        }
      })
      .listen({
        submit: (ev: Event) => this.submitForm(ev)
      });

    this.viewModel.createEffect(($) => {
      if ($.userid && $.token) this.hydrate($.userid, $.token);
    });
  }

  view = createView<ProfileViewData>(
    html`<section>
      ${($) =>
        View.apply<Profile>(
          $.mode === "view" ? this.mainView : this.editView,
          $.profile
        )}
    </section>`
  );

  mainView = createView<Profile>(html`
    ${($) =>
      $.userid === this.viewModel.get("username")
        ? html`<button id="edit-mode">Edit</button>`
        : ""}
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
        <span class="swatch" style=${($) => `background: ${$.color}`}></span>
        <span>${($) => $.color}</span>
      </dd>
    </dl>
  `);

  editView = createView<Profile>(html`
    <form>
      <img src=${($) => $.avatar} alt=${($) => $.name} />
      <h1>
        <span class="aria-only" name="name-label">Display Name</span>
        <input name="name"
          value=${($) => $.name}
          aria-labelled-by="name-label"/>
      </h1>
      <dl>
        <dt id="userid-label">Username</dt>
        <dd>
            <input disabled name="userid"
              value=${($) => $.userid}
              aria-labelled-by="userid-label"/>
        </dd>
        <dt id="nickname-label">Nickname</dt>
        <dd>
            <input name="nickname"
              value=${($) => $.nickname}
              aria-labelled-by="nickname-label"/>
        </dd>
        <dt id="home-label">Home City</dt>
        <dd>
            <input name="home"
              value=${($) => $.home}
              aria-labelled-by="home-label"/>
        </dd>
        <dt id="airports-label">Airports</dt>
        <dd>
          <input-array
            name="airports"
            .value=${($) => $.airports}
            aria-labelled-by="airports-label"/>
          </input-array>
        </dd>
        <dt id="color-label">Favorite Color</dt>
        <dd>
          <span
            class="swatch"
            style=${($) => `background: ${$.color}`}>
          </span>
          <span>
            <input type="color" name="color"
              value=${($) => $.color}
              aria-labelled-by="color-label"/>
          </span>
        </dd>
        <dt id="avatar-label">Upload Profile Image</dt>
        <dd>
            <input type="file" name="avatar"
              aria-labelled-by="avatar-label"/>
        </dd>
      </dl>
      <button id="cancel" type="button">Cancel</button>
      <button type="submit">Save</button>
     </form>
  `);

  static styles = css`
    :host {
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
    form {
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
        if (response.status !== 200)
          throw `HTTP Status: ${response.status}`;
        return response.json();
      })
      .then((json: object) => {
        this.viewModel.set("profile", json as Profile);
      })
      .catch((error) => {
        console.log("Could not fetch:", error);
      });
  }

  submitForm(ev: Event) {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const json = this.formDataToJSON(form);
    const userid = this.viewModel.get("userid");
    const token = this.viewModel.get("token");

    fetch(`/api/profiles/${userid}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: json
    })
      .then((res: Response) => {
        if (res.status !== 200) throw `HTTP status ${res.status}`;
        return res.json();
      })
      .then((json: unknown) => {
        this.viewModel.set("profile", json as Profile);
        this.viewModel.set("mode", "view");
      })
      .catch((err) => console.log("Failed to PUT form data", err));
  }

  formDataToJSON(form: HTMLFormElement): string {
    const inputs = Array.from(form.elements).filter(
      (el) => el.tagName !== "BUTTON" && "name" in el
    ) as Array<HTMLInputElement>;

    const entries = inputs.map((el) => {
      const k = el.name;
      switch (k) {
        case "avatar":
          return [k, this.viewModel.get("_avatar")];
        default:
          return [k, el.value];
      }
    });

    console.log("Entries:", entries);
    return JSON.stringify(Object.fromEntries(entries));
  }

  readAvatarBase64(files: FileList) {
    if (files && files.length) {
      const reader = new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = (err) => reject(err);
        fr.readAsDataURL(files[0]);
      });

      reader.then((result: unknown) => {
        this.viewModel.set("_avatar", result as string);
      });
    }
  }
}
