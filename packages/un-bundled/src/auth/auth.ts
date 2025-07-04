interface AuthModel {
  user?: APIUser | AuthenticatedUser;
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
