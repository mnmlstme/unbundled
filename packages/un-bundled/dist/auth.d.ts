declare class APIUser {
    static TOKEN_KEY: string;
    authenticated: boolean;
    username: string;
    constructor(username?: string);
    static deauthenticate(user: APIUser): APIUser;
}

declare type Async<M, Msg extends Base> = [
now: M,
...later: Array<Promise<Msg | None>>
];

export declare namespace Auth {
    export {
        AUTH_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        AuthenticatedUser,
        dispatch,
        authHeaders as headers,
        tokenPayload as payload,
        AuthProvider as Provider,
        APIUser as User,
        AuthSuccessful,
        AuthModel as Model,
        AuthMsg as Message,
        AuthService as Service
    }
}

declare namespace Auth_2 {
    export {
        AUTH_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        AuthenticatedUser,
        dispatch,
        authHeaders as headers,
        tokenPayload as payload,
        AuthProvider as Provider,
        APIUser as User,
        AuthSuccessful,
        AuthModel as Model,
        AuthMsg as Message,
        AuthService as Service
    }
}

declare const AUTH_CONTEXT_DEFAULT = "context:auth";

declare class AuthenticatedUser extends APIUser {
    token: string | undefined;
    constructor(token: string);
    static authenticate(token: string): AuthenticatedUser;
    static authenticateFromLocalStorage(): APIUser;
}

declare function authHeaders(auth: AuthModel): {
    Authorization?: string;
};

declare interface AuthModel {
    authenticated: boolean;
    username?: string;
    token?: string;
}

declare type AuthMsg = ["auth/signin", AuthSuccessful] | ["auth/signout"] | ["auth/redirect"];

declare class AuthProvider extends Provider<AuthModel> {
    get redirect(): string | undefined;
    constructor();
    connectedCallback(): void;
}

declare class AuthService extends Service<AuthMsg, AuthModel> {
    static EVENT_TYPE: string;
    _redirectForLogin: string | undefined;
    constructor(context: Context<AuthModel>, redirectForLogin: string | undefined);
    update(message: AuthMsg, model: AuthModel): AuthModel | Message_2.Async<AuthModel, AuthMsg>;
}

declare interface AuthSuccessful {
    token: string;
    redirect?: string;
}

declare type Base = Type<string, object | undefined>;

declare class Context<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context<T>);
    get(prop: keyof T): T[typeof prop];
    set(prop: keyof T, value: T[typeof prop]): void;
    toObject(): Readonly<T>;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector<[T]>): void;
    setHost(host: EventTarget, eventType?: string): void;
    open(effect: Effect): Readonly<T>;
    close(): void;
}

declare class Context_2<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context_2<T>);
    get(prop: keyof T): T[typeof prop];
    set(prop: keyof T, value: T[typeof prop]): void;
    toObject(): Readonly<T>;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector_2<[T]>): void;
    setHost(host: EventTarget, eventType?: string): void;
    open(effect: Effect_2): Readonly<T>;
    close(): void;
}

declare class Dispatch<Msg extends Base> extends CustomEvent<Msg> {
    constructor(msg: Msg, eventType?: string);
}

declare const dispatch: (target: HTMLElement, ...msg: AuthMsg) => boolean;

declare const dispatch_2: (target: HTMLElement, ...msg: Base) => boolean;

declare function dispatcher<Msg extends Base>(eventType?: string): (target: HTMLElement, ...msg: Msg) => boolean;

declare interface Effect {
    execute(): void;
}

declare interface Effect_2 {
    execute(): void;
}

declare type EffectArgs = Array<object | undefined>;

declare type EffectArgs_2 = Array<object | undefined>;

declare type Effector<TT extends EffectArgs> = (...scope: TT) => void;

declare type Effector_2<TT extends EffectArgs_2> = (...scope: TT) => void;

export declare function fromAuth(target: HTMLElement, contextLabel?: string): Source<Auth_2.Model>;

declare namespace Message {
    export {
        dispatcher,
        Type,
        Base,
        None,
        Async,
        Dispatch,
        dispatch_2 as dispatch
    }
}

export declare namespace Message_2 {
    export {
        dispatcher,
        Type,
        Base,
        None,
        Async,
        Dispatch,
        dispatch_2 as dispatch
    }
}

declare type None = [];

declare const None: None;

declare type None_2 = Message.None;

declare class Provider<T extends object> extends HTMLElement {
    readonly context: Context<T>;
    contextLabel: string;
    static DISCOVERY_EVENT: string;
    static REGISTRY_EVENT: string;
    static CHANGE_EVENT: string;
    constructor(init: T, label: string);
    attach(observer: SignalReceiver<T>): T;
    detach(observer: SignalReceiver<T>): void;
}

declare class Service<Msg extends Message.Base, T extends object> {
    _context: Context_2<T>;
    _update: Update<Msg, T>;
    _eventType: string;
    _running: boolean;
    _pending: Array<Msg>;
    constructor(update: Update<Msg, T>, context: Context_2<T>, eventType?: string, autostart?: boolean);
    attach(host: Provider<T>): void;
    start(): void;
    consume(message: Msg | None_2): void;
    process(message: Msg): T;
}

declare type Signal<T, K extends keyof T> = {
    property: K;
    value: T[K];
};

declare class SignalEvent<T, K extends keyof T> extends CustomEvent<Signal<T, K>> {
    constructor(eventType: string, signal: Signal<T, K>);
}

declare type SignalReceiver<T> = (ev: SignalEvent<T, keyof T>) => void;

declare interface Source<S extends ViewState> {
    start(fn: SourceEffect<S>): Promise<Partial<S>>;
}

declare type SourceEffect<S extends ViewState> = (name: keyof S, value: any) => void;

declare function tokenPayload(user: APIUser | AuthenticatedUser): object;

declare type Type<msg extends string, T extends object | undefined> = [msg, T] | [msg] | None;

declare type Update<Msg extends Message.Base, M extends object> = (message: Msg, model: M) => M | Message.Async<M, Msg>;

declare type ViewState<T = object> = {
    [K in keyof Partial<T>]: any;
};

export { }
