import { Context } from "../effects";
import { Auth, fromAuth } from "../auth";
import { ApplyMap, Message, Provider, Service } from "../service";
import { createViewModel } from "../view";

const STORE_CONTEXT_DEFAULT = "context:store";

export type Async<M, Cmd extends Message.Base> = [
  now: M,
  ...later: Array<Promise<Cmd>>
];

export type UpdateFn<M extends object, Msg extends Message.Base> = (
  model: M,
  message: Msg
) => M | Async<M, Msg>;

type AuthorizedUpdateFn<
  M extends object,
  Msg extends Message.Base
> = (
  model: M,
  message: Msg,
  auth: Auth.Model
) => M | Async<M, Msg>;

export class StoreService<M extends object, Msg extends Message.Base>
  extends Service<Msg, M> {
  static EVENT_TYPE = "store:message";

  constructor(
    context: Context<M>,
    update: UpdateFn<M, Msg>
  ) {
    super(
      (message: Msg, apply: ApplyMap<M>) => {
        apply((current: M) => {
          const result: M | Async<M, Msg> = update(current, message);
          if (!Array.isArray(result)) return result;
          const [next, ...commands] = result;
          commands.forEach(
            (promise) => promise
              .then((message: Msg) => this.consume(message)))
          return next;
        })
      },
      context,
      StoreService.EVENT_TYPE
    );
  }
}


class StoreProvider<
  M extends object,
  Msg extends Message.Base
> extends Provider<M> {
  viewModel = createViewModel<Auth.Model>({
    authenticated: false
  }).merge(fromAuth(this), ["authenticated", "username", "token"]);

  _updateFn: AuthorizedUpdateFn<M, Msg>;

  constructor(updateFn: AuthorizedUpdateFn<M, Msg>, init: M) {
    super(init, STORE_CONTEXT_DEFAULT);
    this._updateFn = updateFn;
  }

  connectedCallback() {
    const service = new StoreService<M, Msg>(
      this.context,
      (model: M, message: Msg) =>
        this._updateFn(model, message, this.viewModel.toObject())
    );
    service.attach(this);
  }
}

function dispatch<Msg extends Message.Base>(
  target: HTMLElement,
  message: Msg
) {
  console.log("📨 Dispatching message:", message, target);
  target.dispatchEvent(
    new Message.Dispatch<Msg>(
      message,
      StoreService.EVENT_TYPE
    )
  );
}

export {
  STORE_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
  StoreProvider as Provider,
  StoreService as Service,
  dispatch
}
