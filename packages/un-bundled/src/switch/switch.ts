import Route from "route-parser";
import { shadow } from "../html";
import { View, ViewTemplate, createViewModel } from "../view";
import { Auth, fromAuth } from "../auth";
import * as History from "./history";
import { fromHistory } from "./fromHistory";

type RouteParams = {
  [key: string]: string;
};

interface RouteData {
  params: RouteParams;
  query: URLSearchParams;
}

type RouteView = ViewTemplate<RouteData>;
const html = View.html;

type RouteRedirect = string | ((arg: RouteParams) => string);

interface MatchPath {
  path: string;
  query?: URLSearchParams;
  params?: RouteParams;
}

interface CaseRoute {
  route: Route;
}

interface SwitchPath {
  path: string;
}

interface ViewCase {
  view: RouteView;
  auth?: "public" | "protected";
}

interface RedirectCase {
  redirect: RouteRedirect;
}

type SwitchRoute = SwitchPath & (ViewCase | RedirectCase);
type Case = CaseRoute & (ViewCase | RedirectCase);
type Match = MatchPath & (ViewCase | RedirectCase);

interface SwitchData {
  authenticated: boolean;
  username?: string;
  location?: Location;
}

export class Switch extends HTMLElement {
  viewModel = createViewModel<SwitchData>({
    authenticated: false
  })
    .merge(fromAuth(this), ["authenticated", "username"])
    .merge(fromHistory(this), ["location"]);

  _cases: Case[] = [];
  _routeView: ViewTemplate<RouteData> = html`<h1>Routing...</h1>`;
  _routeViewModel = createViewModel<RouteData>({
    params: {},
    query: new URLSearchParams()
  });

  constructor(
    routes: SwitchRoute[],
  ) {
    super();
    this._cases = routes.map((r) => ({
      ...r,
      route: new Route(r.path)
    }));

    this.viewModel.createEffect($ => {
      if ($.location) {
        const nextView = this.routeToView($.location);
        if (nextView !== this._routeView) {
          this._routeView = nextView
          shadow(this)
            .replace(this._routeViewModel.render(nextView));
        }
      }
    });
  }

  routeToView(location: Location): ViewTemplate<RouteData> {
    const { authenticated } = this.viewModel.toObject();
    const m = this.matchRoute(location);

    if (m) {
      if ("view" in m) {
        if (!authenticated) {
          return html`
              <h1>Authenticating</h1>
            `;
        }
        if (m.auth && m.auth !== "public" && !authenticated) {
          Auth.dispatch(this, "auth/redirect");
          return html`
              <h1>Redirecting for Login</h1>
            `;
        } else {
          console.log("Loading view, ", m.params, m.query);
          this._routeViewModel.update({
            params: m.params,
            query: m.query
          })
          return m.view;
        }
      }
      if ("redirect" in m) {
        const redirect = m.redirect;
        if (typeof redirect === "string") {
          this.redirect(redirect);
          return html`
              <h1>Redirecting to ${redirect}…</h1>
            `;
        }
      }
    }
    return html`
      <h1>Not Found</h1>
    `;
  }


  matchRoute(location: Location): Match | undefined {
    const { search, pathname } = location;
    const query = new URLSearchParams(search);
    const path = pathname + search;

    for (const option of this._cases) {
      const params = option.route.match(path);
      if (params) {
        const match = {
          ...option,
          path: pathname,
          params,
          query
        };
        return match;
      }
    }

    return;
  }

  redirect(href: string) {
    History.dispatch(this, "history/redirect", { href });
  }
}

export {
  Switch as Element,
  type RouteData as Args,
  type SwitchRoute as Route
};
