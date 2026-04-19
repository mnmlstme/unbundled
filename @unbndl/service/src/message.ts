export type Type<
  msg extends string,
  T extends object | undefined
> = [msg, T] | [msg] | None;

export type Base = Type<string, object | undefined>;
export type None = [];
export const None: None = [];

export type Async<M, Msg extends Base> = [
  now: M,
  ...later: Array<Promise<Msg | None>>
];

export class Dispatch<
  Msg extends Base
> extends CustomEvent<Msg> {
  constructor(msg: Msg, eventType: string = "un:message") {
    super(eventType, {
      bubbles: true,
      composed: true,
      detail: msg
    });
  }
}

export function dispatcher<Msg extends Base>(
  eventType: string = "un:message"
) {
  return (target: HTMLElement, ...msg: Msg) =>
    target.dispatchEvent(new Dispatch<Msg>(msg, eventType));
}

export const dispatch = dispatcher();
