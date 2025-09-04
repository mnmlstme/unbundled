export type Type<
  msg extends string,
  T extends object | undefined
> = [msg, T] | [msg];

export type Base = Type<string, object | undefined>;

export type Async<M, Cmd extends Base> = [
  now: M,
  ...later: Array<Promise<Cmd>>
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
