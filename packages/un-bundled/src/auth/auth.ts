import { jwtDecode } from "jwt-decode";
import { ApplyMap, Provider, Service, dispatcher, replace } from "../service";
import { Context } from "../view";

const AUTH_CONTEXT_DEFAULT = "context:auth";

interface AuthModel {
  authenticated: boolean;
  username?: string;
  token?: string;
}

interface AuthSuccessful {
  token: string;
  redirect?: string;
}

type AuthMsg =
  | ["auth/signin", AuthSuccessful]
  | ["auth/signout"]
  | ["auth/redirect"];

class APIUser {
  static TOKEN_KEY = "un-auth:token";
  authenticated = false;
  username: string;

  constructor(username?: string) {
    this.username = username || "anonymous";
  }

  static deauthenticate(user: APIUser) {
    user.authenticated = false;
    user.username = "anonymous";
    localStorage.removeItem(APIUser.TOKEN_KEY);
    return user;
  }
}

interface PayloadModel {
  username: string;
}

class AuthenticatedUser extends APIUser {
  token: string | undefined;

  constructor(token: string) {
    super();
    const jsonPayload = jwtDecode(token) as PayloadModel;
    // onsole.log("Token payload", jsonPayload);
    this.token = token;
    this.authenticated = true;
    this.username = jsonPayload.username;
  }

  static authenticate(token: string) {
    const authenticatedUser = new AuthenticatedUser(token);
    localStorage.setItem(APIUser.TOKEN_KEY, token);
    return authenticatedUser;
  }

  static authenticateFromLocalStorage() {
    const priorToken = localStorage.getItem(APIUser.TOKEN_KEY);

    return priorToken
      ? AuthenticatedUser.authenticate(priorToken)
      : new APIUser();
  }
}

class AuthService extends Service<AuthMsg, AuthModel> {
  static EVENT_TYPE = "auth:message";

  _redirectForLogin: string | undefined;

  constructor(
    context: Context<AuthModel>,
    redirectForLogin: string | undefined
  ) {
    super(
      (msg, apply) => this.update(msg, apply),
      context,
      AuthService.EVENT_TYPE
    );
    this._redirectForLogin = redirectForLogin;
  }

  update(message: AuthMsg, apply: ApplyMap<AuthModel>) {
    switch (message[0]) {
      case "auth/signin":
        const { token, redirect } = message[1];
        apply(signIn(token));
        return redirection(redirect);
      case "auth/signout":
        apply(signOut());
        return redirection(this._redirectForLogin);
      case "auth/redirect":
        return redirection(this._redirectForLogin, {
          next: window.location.href
        });
      default:
        const unhandled: never = message[0];
        throw new Error(`Unhandled Auth message "${unhandled}"`);
    }
  }
}

class AuthProvider extends Provider<AuthModel> {
  get redirect() {
    return this.getAttribute("redirect") || undefined;
  }

  constructor() {
    const user = AuthenticatedUser.authenticateFromLocalStorage();
    const { authenticated, username } = user;
    super(
      {
        authenticated,
        username,
        token: authenticated ? (user as AuthenticatedUser).token : undefined
      },
      AUTH_CONTEXT_DEFAULT
    );
  }

  connectedCallback() {
    const service = new AuthService(this.context, this.redirect);
    service.attach(this);
  }
}

const dispatch = dispatcher<AuthMsg>(AuthService.EVENT_TYPE);

function redirection(
  redirect: string | undefined,
  query: { [key: string]: string } = {}
) {
  if (!redirect) return undefined;

  const base = window.location.href;
  const target = new URL(redirect, base);

  Object.entries(query).forEach(([k, v]) => target.searchParams.set(k, v));

  return () => {
    //console.log("Redirecting to ", redirect);
    window.location.assign(target);
  };
}

function signIn(token: string) {
  const user = AuthenticatedUser.authenticate(token);
  const { authenticated, username } = user;
  return replace<AuthModel>({
    authenticated,
    username,
    token
  });
}

function signOut() {
  return (model: AuthModel) => {
    const oldUser = APIUser.deauthenticate(new APIUser(model.username));
    const { authenticated, username } = oldUser;

    return {
      username,
      authenticated
    };
  };
}

function authHeaders(user: APIUser | AuthenticatedUser): {
  Authorization?: string;
} {
  if (user.authenticated) {
    const authUser = user as AuthenticatedUser;
    return {
      Authorization: `Bearer ${authUser.token || "NO_TOKEN"}`
    };
  } else {
    return {};
  }
}

function tokenPayload(user: APIUser | AuthenticatedUser): object {
  if (user.authenticated) {
    const authUser = user as AuthenticatedUser;
    return jwtDecode(authUser.token || "");
  } else {
    return {};
  }
}

export {
  AUTH_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
  AuthenticatedUser,
  dispatch,
  authHeaders as headers,
  tokenPayload as payload,
  AuthProvider as Provider,
  APIUser as User,
  type AuthSuccessful,
  type AuthModel as Model,
  type AuthMsg as Msg,
  type AuthService as Service
};
