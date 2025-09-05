import {
  define,
  html,
  Auth,
  History,
  Store,
  Switch
} from "@un-bundled/unbundled";
import { Model, init } from "./model.ts";
import { Msg } from "./message.ts";
import { Cmd, update } from "./update.ts";
import { HeaderElement } from "./components/header-element";
import { HomeViewElement } from "./views/home-view.ts";
import { TourViewElement } from "./views/tour-view.ts";
import { ProfileViewElement } from "./views/profile-view.ts";

const routes: Switch.Route[] = [
  {
    auth: "protected",
    path: "/app/profile/:userid",
    view: html`
      <profile-view
        user-id=${($) => $.params.userid}></profile-view>
    `
  },
  {
    auth: "protected",
    path: "/app/tour/:id",
    view: html`
      <tour-view tour-id=${($) => $.params.id}></tour-view>
    `
  },
  {
    path: "/app",
    view: html`
      <home-view
        user-id=${($) =>
          ($.user?.authenticated && $.user?.username) ||
          "anonymous"}></home-view>
    `
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
  "store-provider": class AppStore extends Store.Provider<
    Model,
    Msg,
    Cmd
  > {
    constructor() {
      super(update, init);
    }
  },
  // pages:
  "home-view": HomeViewElement,
  "profile-view": ProfileViewElement,
  "tour-view": TourViewElement
});
