import { default as default_2 } from 'route-parser';

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

declare type Base = Type<string, object | undefined>;

export declare namespace BrowserHistory {
    export {
        HISTORY_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        HistoryProvider as Provider,
        HistoryService as Service,
        HistoryModel as Model,
        HistoryMsg as Message,
        dispatch_2 as dispatch
    }
}

declare namespace BrowserHistory_2 {
    export {
        HISTORY_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        HistoryProvider as Provider,
        HistoryService as Service,
        HistoryModel as Model,
        HistoryMsg as Message,
        dispatch_2 as dispatch
    }
}

declare type Case = CaseRoute & (ViewCase | RedirectCase);

declare interface CaseRoute {
    route: default_2;
}

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

declare class Context_4<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context_4<T>);
    get(prop: keyof T): T[typeof prop];
    set(prop: keyof T, value: T[typeof prop]): void;
    toObject(): Readonly<T>;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector_4<[T]>): void;
    setHost(host: EventTarget, eventType?: string): void;
    open(effect: Effect_4): Readonly<T>;
    close(): void;
}

declare class Dispatch<Msg extends Base> extends CustomEvent<Msg> {
    constructor(msg: Msg, eventType?: string);
}

declare const dispatch: (target: HTMLElement, ...msg: Base) => boolean;

declare const dispatch_2: (target: HTMLElement, ...msg: HistoryMsg) => boolean;

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

declare interface Effect_4 {
    execute(): void;
}

declare type EffectArgs = Array<object | undefined>;

declare type EffectArgs_2 = Array<object | undefined>;

declare type EffectArgs_3 = Array<object | undefined>;

declare type EffectArgs_4 = Array<object | undefined>;

declare type Effector<TT extends EffectArgs> = (...scope: TT) => void;

declare type Effector_2<TT extends EffectArgs_2> = (...scope: TT) => void;

declare type Effector_3<TT extends EffectArgs_3> = (...scope: TT) => void;

declare type Effector_4<TT extends EffectArgs_4> = (...scope: TT) => void;

export declare function fromHistory(target: HTMLElement, contextLabel?: string): FromService<BrowserHistory_2.Model>;

declare class FromService<T extends object> implements Source_2<T> {
    private client;
    private observer;
    constructor(client: HTMLElement, contextLabel: string);
    start(fn: SourceEffect_2<T>): Promise<Partial<T>>;
}

declare const HISTORY_CONTEXT_DEFAULT = "context:history";

declare interface HistoryModel {
    location: Location;
    state: object;
}

declare type HistoryMsg = [
"history/navigate",
    {
    href: string;
    state?: object;
}
] | [
"history/redirect",
    {
    href: string;
    state?: object;
}
];

declare class HistoryProvider extends Provider<HistoryModel> {
    constructor();
    get base(): string | undefined;
    connectedCallback(): void;
    attributeChangedCallback(): void;
}

declare class HistoryService extends Service<HistoryMsg, HistoryModel> {
    static EVENT_TYPE: string;
    constructor(context: Context_2<HistoryModel>);
    update(message: HistoryMsg, model: HistoryModel): HistoryModel;
}

declare type Match = MatchPath & (ViewCase | RedirectCase);

declare interface MatchPath {
    path: string;
    query?: URLSearchParams;
    params?: RouteParams;
}

declare namespace Message {
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

declare interface RedirectCase {
    redirect: RouteRedirect;
}

declare type RenderFunction<TT extends TemplateArgs> = (...args: Scope<TT>) => DocumentFragment;

declare type RenderFunction_2<TT extends TemplateArgs_2> = (...args: Scope_2<TT>) => DocumentFragment;

declare interface RouteData {
    params: RouteParams;
    query: URLSearchParams;
    user?: Auth.Model;
}

declare type RouteParams = {
    [key: string]: string;
};

declare type RouteRedirect = string | ((arg: RouteParams) => string);

declare type RouteView = Template_2<[RouteData]>;

declare type Scope<TT extends EffectArgs_3> = {
    [Index in keyof TT]: TT[Index] extends object ? Context_3<TT[Index]> : object;
};

declare type Scope_2<TT extends EffectArgs_4> = {
    [Index in keyof TT]: TT[Index] extends object ? Context_4<TT[Index]> : object;
};

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

declare interface Source_2<S extends ViewState_2> {
    start(fn: SourceEffect_2<S>): Promise<Partial<S>>;
}

declare type SourceEffect<S extends ViewState> = (name: keyof S, value: any) => void;

declare type SourceEffect_2<S extends ViewState_2> = (name: keyof S, value: any) => void;

export declare namespace Switch {
    export {
        Switch_2 as Switch,
        Switch_2 as Element,
        RouteData as Args,
        SwitchRoute as Route
    }
}

declare class Switch_2 extends HTMLElement {
    viewModel: ViewModel<SwitchData>;
    _cases: Case[];
    _routeView: Template_2<[RouteData]>;
    _routeViewModel: ViewModel<RouteData>;
    constructor(routes: SwitchRoute[]);
    routeToView(location: Location, authenticated?: boolean, username?: string): Template_2<[RouteData]>;
    matchRoute(location: Location): Match | undefined;
    redirect(href: string): void;
}

declare interface SwitchData {
    authenticated: boolean;
    username?: string;
    location?: Location;
}

declare interface SwitchPath {
    path: string;
}

declare type SwitchRoute = SwitchPath & (ViewCase | RedirectCase);

declare interface Template<TT extends TemplateArgs> extends DocumentFragment {
    render: RenderFunction<TT>;
}

declare interface Template_2<TT extends TemplateArgs_2> extends DocumentFragment {
    render: RenderFunction_2<TT>;
}

declare type TemplateArgs = Array<object | undefined>;

declare type TemplateArgs_2 = Array<object | undefined>;

declare type Type<msg extends string, T extends object | undefined> = [msg, T] | [msg] | None;

declare type Update<Msg extends Message.Base, M extends object> = (message: Msg, model: M) => M | Message.Async<M, Msg>;

declare interface ViewCase {
    view: RouteView;
    auth?: "public" | "protected";
}

declare class ViewModel<T extends ViewState<T>> extends Context_3<T> {
    constructor(init: T, adoptedContext?: Context_3<T>);
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
