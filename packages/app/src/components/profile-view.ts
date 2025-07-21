import {
  css,
  define,
  View,
  ViewModel,
  ViewTemplate,
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

function createView<T extends object>(html: ViewTemplate<T>) {
  return html;
}

const html = View.html;

export class ProfileViewElement extends HTMLElement {
  static uses = define({
    "input-array": InputArrayElement
  });

  viewModel = createViewModel({
    mode: "view",
    profile: undefined
  })
    .merge(
      {
        token: undefined,
        username: undefined
      },
      fromAuth(this)
    )
    .merge(
      {
        userid: undefined
      },
      fromAttributes(this)
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
      console.log("Maybe hydrate?", $.userid, $.token);
      if ($.userid && $.token) this.hydrate($.userid, $.token);
    });
  }

  view = createView<ProfileViewData>(
    html` <section>
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
          <input-array ${($, ref) => {
            console.log("Setting airports value", $.airports);
            (ref as InputArrayElement).value = $.airports;
          }}
            name="airports"
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

  submitForm(ev: Event) {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const inputs = Array.from(form.elements).filter(
      (el) => el.tagName !== "BUTTON" && "name" in el
    ) as Array<HTMLInputElement>;
    console.log("Inputs:", inputs);
    const entries = inputs.map((el) => [el.name, el.value]);
    console.log("Entries:", entries);
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
    const formdata = new FormData(form);
    const entries = Array.from(formdata.entries())
      .map(([k, v]) => (v === "" ? [k] : [k, v]))
      .map(([k, v]) =>
        k === "avatar" ? [k, this.viewModel.get("_avatar")] : [k, v]
      );

    const profile = raiseStructure(entries as Array<FormEntry>);
    return JSON.stringify(profile);
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

type FormEntry = [string, string, ...rest: string[]];
type PathedEntry = [Array<string>, string, ...rest: string[]];
type ObjectEntry = [string, string | object | Array<any>];

function raiseStructure(entries: Array<FormEntry>): object {
  const pathed: Array<PathedEntry> = entries.map(([key, ...values]) => [
    key
      .split(/\]?\.|\[/)
      .map((s) => (s.endsWith("]") ? s.substring(0, s.length - 1) : s)),
    ...values
  ]);

  return fromPathedEntries(pathed);

  function fromPathedEntries(pathed: Array<PathedEntry>): object {
    const deepPaths = pathed.filter(([path]) => path.length > 1);
    let entries: Array<ObjectEntry> = pathed
      .filter(([path]) => path.length === 1)
      .map(([path, ...values]) => [path[0], values[0]]);

    if (deepPaths.length) {
      const groups: Map<string | number, Array<PathedEntry>> = new Map();
      pathed
        .filter(([path]) => path.length > 1)
        .forEach(([path, ...values]) => {
          const [key, ...rest] = path;
          const newEntry: PathedEntry = [rest, ...values];
          const group = groups.get(key);
          if (group) group.push(newEntry);
          else groups.set(key, [newEntry]);
        });

      const flattenedEntries: Array<ObjectEntry> = Array.from(
        groups.entries()
      ).map(([key, pathedEntries]) => [key, fromPathedEntries(pathedEntries)]);
      entries = entries.concat(flattenedEntries);
    }
    return Object.fromEntries(entries);
  }
}
