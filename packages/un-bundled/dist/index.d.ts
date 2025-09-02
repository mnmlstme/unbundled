import { default as default_2 } from 'route-parser';
import { ViewModel as ViewModel_2 } from '..';

declare class APIUser {
    static TOKEN_KEY: string;
    authenticated: boolean;
    username: string;
    constructor(username?: string);
    static deauthenticate(user: APIUser): APIUser;
}

export declare function apply<TT extends TemplateArgs>(view: Template<TT>, tuple: TT | undefined): TemplateValue;

export declare type ApplyMap<M> = (fn: MapFn<M>) => void;

declare type ArrayArgs<TT extends TemplateArgs> = {
    [Index in keyof TT]: Array<TT[Index]>;
};

declare type Async<M, Cmd extends Message.Base> = [
now: M,
...later: Array<Promise<Cmd>>
];

export declare namespace Auth {
    export {
        AUTH_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        AuthenticatedUser,
        dispatch_2 as dispatch,
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
        dispatch_2 as dispatch,
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

declare type AuthorizedUpdateFn<M extends object, Msg extends Message.Base> = (model: M, message: Msg, auth: Auth.Model) => M | Async<M, Msg>;

declare class AuthProvider extends Provider<AuthModel> {
    get redirect(): string | undefined;
    constructor();
    connectedCallback(): void;
}

declare class AuthService extends Service<AuthMsg, AuthModel> {
    static EVENT_TYPE: string;
    _redirectForLogin: string | undefined;
    constructor(context: Context<AuthModel>, redirectForLogin: string | undefined);
    update(message: AuthMsg, apply: ApplyMap<AuthModel>): (() => void) | undefined;
}

declare interface AuthSuccessful {
    token: string;
    redirect?: string;
}

declare type Base = Type<string, object | undefined>;

declare type BasicTemplateValue = string | number | boolean | Node | null;

declare type Case = CaseRoute & (ViewCase | RedirectCase);

declare interface CaseRoute {
    route: default_2;
}

export declare type Command<M extends object> = (model: Context<M>) => void;

export declare class Context<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context<T>);
    get(prop: keyof T): T[keyof T];
    set(prop: keyof T, value: any): void;
    toObject(): Readonly<T>;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector<[T]>): void;
    setHost(host: EventTarget, eventType?: string): void;
    open(effect: Effect): Readonly<T>;
    close(): void;
}

export declare function createContext<T extends object>(root: T, manager: EffectsManager<T>): T;

export declare function createEffect<TT extends EffectArgs>(fn: Effector<TT>, ...scope: Scope<TT>): void;

export declare function createScope<TT extends EffectArgs>(tuple: TT): Scope<TT>;

export declare function createView<TT extends TemplateArgs>(html: Template<TT>): Template<TT>;

export declare function createViewModel<T extends object>(init?: T): ViewModel<T>;

export declare function css(template: TemplateStringsArray, ...params: string[]): CSSStyleSheet;

export declare function define(defns: ElementDefinitions): CustomElementRegistry;

declare function delegate(element: Element | DocumentFragment, selector: string, map: EventMap): void;

export declare class DirectEffect<TT extends EffectArgs> implements Effect {
    private effectFn;
    constructor(fn: Effector<TT>, ...scope: TT);
    execute(): void;
}

export declare function discover<T extends object>(observer: Element, contextLabel: string): Promise<Provider<T>>;

declare class Dispatch<Msg extends Base> extends CustomEvent<Msg> {
    constructor(msg: Msg, eventType?: string);
}

declare const dispatch: (target: HTMLElement, ...msg: Base) => boolean;

declare const dispatch_2: (target: HTMLElement, ...msg: AuthMsg) => boolean;

declare const dispatch_3: (target: HTMLElement, ...msg: HistoryMsg) => boolean;

declare function dispatch_4<Msg extends Message.Base>(target: HTMLElement, message: Msg): void;

declare function dispatcher<Msg extends Base>(eventType?: string): (target: HTMLElement, ...msg: Msg) => boolean;

export declare interface Effect {
    execute(): void;
}

export declare type EffectArgs = Array<object>;

export declare type Effector<TT extends EffectArgs> = (...scope: TT) => void;

export declare class EffectsManager<T extends object> {
    private running;
    private host?;
    private eventType;
    isRunning(): boolean;
    push(effect: Effect): void;
    pop(): void;
    current(): Effect | undefined;
    subscribe(key: keyof T, scope: T): void;
    runEffects(key: keyof T, scope: T): void;
    setHost(host: EventTarget, eventType?: string): void;
}

declare type ElementDefinitions = {
    [tag: string]: CustomElementConstructor;
};

declare type EventListener_2 = (ev: Event) => void;
export { EventListener_2 as EventListener }

export declare type EventMap = {
    [key: string]: EventListener_2;
};

export declare const Events: {
    listen: typeof listen;
    delegate: typeof delegate;
};

export declare function exposeTuple<TT extends EffectArgs>(scope: Scope<TT>): TT;

declare class FromAttributes<T extends object> implements Source<T> {
    subject: Element;
    constructor(subject: Element);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare function fromAttributes<T extends object>(subject: Element): FromAttributes<T>;

export declare function fromAuth(target: HTMLElement, contextLabel?: string): FromService<Auth_2.Model>;

export declare function fromHistory(target: HTMLElement, contextLabel?: string): FromService<History_3.Model>;

declare class FromInputs<T extends object> implements Source<T> {
    subject: Node;
    constructor(subject: Node);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare function fromInputs<T extends object>(subject: Node): FromInputs<T>;

export declare class FromService<T extends object> implements Source<T> {
    private client;
    private observer;
    constructor(client: HTMLElement, contextLabel: string);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare function fromService<T extends object>(target: HTMLElement, contextLabel: string): FromService<T>;

export declare function fromStore<M extends object>(target: HTMLElement, contextLabel?: string): FromService<M>;

export declare namespace History_2 {
    export {
        HistoryProvider,
        HISTORY_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        HistoryProvider as Provider,
        HistoryService as Service,
        HistoryModel as Model,
        HistoryMsg as Message,
        dispatch_3 as dispatch
    }
}

declare namespace History_3 {
    export {
        HistoryProvider,
        HISTORY_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        HistoryProvider as Provider,
        HistoryService as Service,
        HistoryModel as Model,
        HistoryMsg as Message,
        dispatch_3 as dispatch
    }
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
    get base(): string | undefined;
    constructor();
    connectedCallback(): void;
    attributeChangedCallback(): void;
}

declare class HistoryService extends Service<HistoryMsg, HistoryModel> {
    static EVENT_TYPE: string;
    constructor(context: Context<HistoryModel>);
    update(message: HistoryMsg, apply: ApplyMap<HistoryModel>): void;
}

export declare function html<TT extends TemplateArgs>(template: TemplateStringsArray, ...params: Array<TemplateParameter<TT>>): Template<TT>;

export declare function identity<M>(model: M): M;

/**
 * Memory leak warning!
 * Need to also clean up all the event listeners, probably
 * on disconnectCallback();
 */
declare function listen(element: Element | DocumentFragment, map: EventMap): void;

export declare function map<TT extends TemplateArgs>(view: Template<TT>, ...lists: ArrayArgs<TT>): TemplateValue;

export declare type MapFn<M> = (model: M) => M;

declare type Match = MatchPath & (ViewCase | RedirectCase);

declare interface MatchPath {
    path: string;
    query?: URLSearchParams;
    params?: RouteParams;
}

export declare namespace Message {
    export {
        dispatcher,
        Type,
        Base,
        Dispatch,
        dispatch
    }
}

declare namespace Message_2 {
    export {
        dispatcher,
        Type,
        Base,
        Dispatch,
        dispatch
    }
}

export declare type NameMapping<T extends object, S extends object> = {
    [K in keyof Partial<T>]: keyof Partial<S> | ((s: S) => any);
};

export declare class Observer<T extends object> {
    private contextLabel;
    private provider?;
    private observed?;
    constructor(contextLabel: string);
    observe(from: Element, fn: Effector<[Signal<T, keyof T>]>): Promise<T>;
    private attachObserver;
}

export declare class Provider<T extends object> extends HTMLElement {
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

export declare function replace<M>(replacements: Partial<M>): MapFn<M>;

declare interface RouteData {
    params: RouteParams;
    query: URLSearchParams;
    user?: Auth.Model;
}

declare type RouteParams = {
    [key: string]: string;
};

declare type RouteRedirect = string | ((arg: RouteParams) => string);

declare type RouteView = Template<[RouteData]>;

export declare class Scheduler {
    private signals;
    private scheduled;
    static scheduler: Scheduler;
    subscribe<T extends object>(scope: T, key: keyof T, effect: Effect): void;
    scheduleEffects<T extends object>(scope: T, key: keyof T): void;
}

export declare type Scope<TT extends EffectArgs> = {
    [Index in keyof TT]: Context<TT[Index]>;
};

export declare class Service<Msg extends Base, T extends object> {
    _context: Context<T>;
    _update: Update<Msg, T>;
    _eventType: string;
    _running: boolean;
    _pending: Array<Msg>;
    attach(host: Provider<T>): void;
    start(): void;
    constructor(update: Update<Msg, T>, context: Context<T>, eventType?: string, autostart?: boolean);
    apply(fn: MapFn<T>): void;
    consume(message: Msg): void;
    process(message: Msg): void;
}

export declare function shadow(el: HTMLElement, options?: ShadowRootInit): {
    template: (fragment: DocumentFragment) => /*elided*/ any;
    styles: (...sheets: CSSStyleSheet[]) => /*elided*/ any;
    replace: (fragment: DocumentFragment) => /*elided*/ any;
    root: ShadowRoot;
    delegate: (selector: string, map: EventMap) => /*elided*/ any;
    listen: (map: EventMap) => /*elided*/ any;
};

export declare type Signal<T, K extends keyof T> = {
    property: K;
    value: T[K];
};

export declare class SignalEvent<T, K extends keyof T> extends CustomEvent<Signal<T, K>> {
    constructor(eventType: string, signal: Signal<T, K>);
}

export declare type SignalReceiver<T> = (ev: SignalEvent<T, keyof T>) => void;

export declare type Signals<T extends object> = Map<keyof T, Set<Effect>>;

export declare interface Source<T extends object> {
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare type SourceEffect<T> = (name: keyof T, value: any) => void;

export declare namespace Store {
    export {
        Async,
        UpdateFn,
        StoreService,
        STORE_CONTEXT_DEFAULT as CONTEXT_DEFAULT,
        StoreProvider as Provider,
        StoreService as Service,
        dispatch_4 as dispatch
    }
}

declare const STORE_CONTEXT_DEFAULT = "context:store";

declare class StoreProvider<M extends object, Msg extends Message.Base> extends Provider<M> {
    viewModel: ViewModel_2<Auth.Model>;
    _updateFn: AuthorizedUpdateFn<M, Msg>;
    constructor(updateFn: AuthorizedUpdateFn<M, Msg>, init: M);
    connectedCallback(): void;
}

declare class StoreService<M extends object, Msg extends Message.Base> extends Service<Msg, M> {
    static EVENT_TYPE: string;
    constructor(context: Context<M>, update: UpdateFn<M, Msg>);
}

export declare namespace Switch {
    export {
        Switch_2 as Switch,
        Switch_2 as Element,
        RouteData as Args,
        SwitchRoute as Route
    }
}

declare class Switch_2 extends HTMLElement {
    viewModel: ViewModel_2<SwitchData>;
    _cases: Case[];
    _routeView: Template<[RouteData]>;
    _routeViewModel: ViewModel_2<RouteData>;
    constructor(routes: SwitchRoute[]);
    routeToView(location: Location, authenticated?: boolean, username?: string): Template<[RouteData]>;
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

export declare type Template<TT extends TemplateArgs> = (...args: Scope<TT>) => DocumentFragment;

export declare type TemplateArgs = Array<object>;

export declare type TemplateEffect<TT extends TemplateArgs> = (...args: TT) => TemplateValue;

export declare type TemplateParameter<TT extends TemplateArgs> = TemplateValue | TemplateEffect<TT> | TemplateReferenceEffect<TT>;

export declare type TemplateReferenceEffect<TT extends TemplateArgs> = (ref: Element, ...args: TT) => void;

export declare type TemplateValue = BasicTemplateValue | Array<BasicTemplateValue>;

declare function tokenPayload(user: APIUser | AuthenticatedUser): object;

declare type Type<msg extends string, T extends object | undefined> = [msg, T] | [msg];

export declare type Update<Msg extends Message_2.Base, M extends object> = (message: Msg, apply: ApplyMap<M>) => Command<M> | void;

declare type UpdateFn<M extends object, Msg extends Message.Base> = (model: M, message: Msg) => M | Async<M, Msg>;

declare interface ViewCase {
    view: RouteView;
    auth?: "public" | "protected";
}

export declare class ViewModel<T extends object> extends Context<T> {
    constructor(init: Partial<T>, adoptedContext?: Context<T>);
    get $(): Readonly<T>;
    merge<S extends object>(source: Source<S>, mapping: NameMapping<T, S> | Array<NameMapping<T, S> | (keyof T & keyof S)>): ViewModel<T>;
    render(template: Template<[T]>): DocumentFragment;
}

export { }
