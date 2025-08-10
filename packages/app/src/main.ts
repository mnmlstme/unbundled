import { define, Auth, History, Switch, View } from "@un-/bundled";
import { HeaderElement } from "./components/header-element";
import { ProfileViewElement } from "./pages/profile-view";

const html = View.html<Switch.Args>;

const routes = [
  {
    auth: "protected",
    path: "/app/profile/:userid",
    view: html`<profile-view user-id=${$ => $.params.userid}></profile-view>`
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
  "router-switch": class RouterSwitch extends Switch.Element {
    constructor() {
      super(routes);
    }
  },
  // pages:
  "profile-view": ProfileViewElement
});
