declare type Async<M, Msg extends Base> = [
now: M,
...later: Array<Promise<Msg | None>>
];

declare namespace Auth {
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

declare type AuthorizedUpdateFn<M extends object, Msg extends Message.Base, Cmd extends Message.Base> = (model: M, message: Msg | Cmd, auth: Auth.Model) => M | Message.Async<M, Cmd>;

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

declare class Context_3<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context_3<T>);
    get(prop: keyof T): T[typeof prop];
    set(prop: keyof T, value: T[typeof prop]): void;
    toObject(): Readonly<T>;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector_3<[T]>): void;
    setHost(host: EventTarget, eventType?: string): void;
    open(effect: Effect_3): Readonly<T>;
    close(): void;
}

declare class Dispatch<Msg extends Base> extends CustomEvent<Msg> {
    constructor(msg: Msg, eventType?: string);
}

declare const dispatch: (target: HTMLElement, ...msg: Base) => boolean;

declare function dispatch_2<Msg extends Message.Base>(target: HTMLElement, message: Msg): void;

declare function dispatcher<Msg extends Base>(eventType?: string): (target: HTMLElement, ...msg: Msg) => boolean;

declare interface Effect {
    execute(): void;
}

declare interface Effect_2 {
    execute(): void;
}

declare interface Effect_3 {
    execute(): void;
}

declare type EffectArgs = Array<object | undefined>;

declare type EffectArgs_2 = Array<object | undefined>;

declare type EffectArgs_3 = Array<object | undefined>;

declare type Effector<TT extends EffectArgs> = (...scope: TT) => void;

declare type Effector_2<TT extends EffectArgs_2> = (...scope: TT) => void;

declare type Effector_3<TT extends EffectArgs_3> = (...scope: TT) => void;

declare class FromService<T extends object> implements Source_2<T> {
    private client;
    private observer;
    constructor(client: HTMLElement, contextLabel: string);
    start(fn: SourceEffect_2<T>): Promise<Partial<T>>;
}

export declare function fromStore<M extends object>(target: HTMLElement, contextLabel?: string): FromService<M>;

export declare namespace Message {
    export {
        dispatcher,
        Type,
        Base,
        None,
        Async,
        Dispatch,
        dispatch
    }
}

declare namespace Message_2 {
    export {
        dispatcher,
        Type,
        Base,
        None,
        Async,
        Dispatch,
        dispatch
    }
}

declare type NameMapping<T extends object, S extends object> = {
    [K in keyof Partial<T>]: keyof S | ((s: S) => Required<T>[K]);
};

declare type None = [];

declare const None: None;

declare type None_2 = Message_2.None;

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

declare type RenderFunction<TT extends TemplateArgs> = (...args: Scope<TT>) => DocumentFragment;

declare type Scope<TT extends EffectArgs_2> = {
    [Index in keyof TT]: TT[Index] extends object ? Context_2<TT[Index]> : object;
};

declare class Service<Msg extends Message_2.Base, T extends object> {
    _context: Context_3<T>;
    _update: Update<Msg, T>;
    _eventType: string;
    _running: boolean;
    _pending: Array<Msg>;
    constructor(update: Update<Msg, T>, context: Context_3<T>, eventType?: string, autostart?: boolean);
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

declare interface Source_2<S extends ViewState_2> {
    start(fn: SourceEffect_2<S>): Promise<Partial<S>>;
}

declare type SourceEffect<S extends ViewState> = (name: keyof S, value: any) => void;

declare type SourceEffect_2<S extends ViewState_2> = (name: keyof S, value: any) => void;

export declare namespace Store {
    export {
        STORE_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        StoreProvider as Provider,
        StoreService as Service,
        dispatch_2 as dispatch
    }
}

declare const STORE_CONTEXT_DEFAULT = "context:store";

declare class StoreProvider<M extends object, Msg extends Message.Base, Cmd extends Message.Base> extends Provider<M> {
    viewModel: ViewModel<Auth.Model>;
    _updateFn: AuthorizedUpdateFn<M, Msg, Cmd>;
    constructor(updateFn: AuthorizedUpdateFn<M, Msg, Cmd>, init: M);
    connectedCallback(): void;
}

declare class StoreService<M extends object, Msg extends Message.Base, Cmd extends Message.Base> extends Service<Msg | Cmd, M> {
    static EVENT_TYPE: string;
    constructor(context: Context_3<M>, update: UpdateFn<M, Msg, Cmd>);
}

declare interface Template<TT extends TemplateArgs> extends DocumentFragment {
    render: RenderFunction<TT>;
}

declare type TemplateArgs = Array<object | undefined>;

declare type Type<msg extends string, T extends object | undefined> = [msg, T] | [msg] | None;

declare type Update<Msg extends Message_2.Base, M extends object> = (message: Msg, model: M) => M | Message_2.Async<M, Msg>;

declare type UpdateFn<M extends object, Msg extends Message.Base, Cmd extends Message.Base> = (model: M, message: Msg | Cmd) => M | Message.Async<M, Cmd>;

declare class ViewModel<T extends ViewState<T>> extends Context_2<T> {
    constructor(init: T, adoptedContext?: Context_2<T>);
    get $(): Readonly<T>;
    with<S extends ViewState<T> = T>(source: Source<S>, ...keys: Array<keyof S & keyof T>): ViewModel<T>;
    withCalculated<S extends ViewState>(source: Source<S>, mapping: NameMapping<T, S>): ViewModel<T>;
    withRenamed<S extends ViewState>(source: Source<S>, renaming: {
        [K in keyof Partial<T>]: keyof S;
    }): ViewModel<T>;
    merge<S extends ViewState<T>>(source: Source<S>): ViewModel<T>;
    render(template: Template<[T]>): DocumentFragment;
}

declare type ViewState<T = object> = {
    [K in keyof Partial<T>]: any;
};

declare type ViewState_2<T = object> = {
    [K in keyof Partial<T>]: any;
};

export { }
