import { define, Auth, History, Store, Switch, View } from "@un-/bundled";
import { Model, init } from "./model.ts";
import { Message } from "./message.ts";
import { update } from "./update.ts";
import { HeaderElement } from "./components/header-element";
import { ProfileViewElement } from "./pages/profile-view";

const html = View.html<Switch.Args>;

const routes: Switch.Route[] = [
  {
    auth: "protected",
    path: "/app/profile/:userid",
    view: html`<profile-view
        user-id=${$ => $.params.userid}>
      </profile-view>`
  },
  {
    path: "/app",
    view: html`<home-view
      user-id=${$ => $.user?.authenticated ?
        $.user?.username :
        "anonymous"}
      >
      </home-view>`
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "auth-provider": Auth.Provider,
  "history-provider": History.Provider,
  "blazing-header": HeaderElement,
  "router-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes);
    }
  },
  "store-provider": class AppStore extends Store.Provider<Model, Message> {
    constructor() {
      super(update, init);
    }
  },
  // pages:
  "profile-view": ProfileViewElement
});
