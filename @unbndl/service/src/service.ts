import { Context } from "../effects";
import { Provider } from "./provider.ts";
import * as Message from "./message.ts";
import { Update } from "./update.ts";

type None = Message.None;

export class Service<
  Msg extends Message.Base,
  T extends object
> {
  _context: Context<T>;
  _update: Update<Msg, T>;
  _eventType: string;
  _running: boolean;
  _pending: Array<Msg> = [];

  constructor(
    update: Update<Msg, T>,
    context: Context<T>,
    eventType = "service:message",
    autostart = true
  ) {
    this._context = context;
    this._update = update;
    this._eventType = eventType;
    this._running = autostart;
  }

  attach(host: Provider<T>) {
    host.addEventListener(this._eventType, (ev: Event) => {
      ev.stopPropagation();
      const message = (ev as Message.Dispatch<Msg>).detail;
      this.consume(message);
    });
  }

  start() {
    if (!this._running) {
      // console.log(`Starting ${this._eventType} service`);
      this._running = true;
      this._pending.forEach((msg) => this.process(msg));
    }
  }

  consume(message: Msg | None) {
    if (message.length === 0 ) {
      const trueMsg = message as Msg;
      if (this._running) {
        this.process(trueMsg);
      } else {
        // console.log(
        //   `📥 Queueing ${this._eventType} message`,
        //   message
        // );
        this._pending.push(trueMsg);
      }
    }
  }

  process(message: Msg) {
    // console.log(
    //   `📤 Processing ${this._eventType} message`,
    //   message
    // );
    const next: T | Message.Async<T, Msg> = this._update(
      message,
      this._context.toObject()
    );
    if (!Array.isArray(next)) return next;
    const [now, ...later] = next;
    later.forEach((promise) =>
      promise.then((command: Msg | None) =>
        this.consume(command)
      )
    );
    return now;
  }
}
