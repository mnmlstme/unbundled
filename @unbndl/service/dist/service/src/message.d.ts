export type Type<msg extends string, T extends object | undefined> = [msg, T] | [msg] | None;
export type Base = Type<string, object | undefined>;
export type None = [];
export declare const None: None;
export type Async<M, Msg extends Base> = [
    now: M,
    ...later: Array<Promise<Msg | None>>
];
export declare class Dispatch<Msg extends Base> extends CustomEvent<Msg> {
    constructor(msg: Msg, eventType?: string);
}
export declare function dispatcher<Msg extends Base>(eventType?: string): (target: HTMLElement, ...msg: Msg) => boolean;
export declare const dispatch: (target: HTMLElement, ...msg: Base) => boolean;
