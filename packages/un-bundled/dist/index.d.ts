import { DynamicDocumentFragment as DynamicDocumentFragment_2 } from './template.ts';

declare class APIUser {
    static TOKEN_KEY: string;
    authenticated: boolean;
    username: string;
    constructor(username?: string);
    static deauthenticate(user: APIUser): APIUser;
}

declare function apply<T extends object>(view: ViewTemplate<T>, $: T | undefined): "" | DynamicDocumentFragment;

export declare type ApplyMap<M> = (fn: MapFn<M>) => void;

export declare interface AttributeValuePlace extends Place<"attr value"> {
    tagName: string;
    attrName: string;
}

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
        AuthMsg as Msg,
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
        AuthMsg as Msg,
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

declare function authHeaders(user: APIUser | AuthenticatedUser): {
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
    update(message: AuthMsg, apply: ApplyMap<AuthModel>): (() => void) | undefined;
}

declare interface AuthSuccessful {
    token: string;
    redirect?: string;
}

export declare type Base = Type<string, object | undefined>;

export declare type Command<M extends object> = (model: Context<M>) => void;

export declare class Context<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context<T>);
    get(prop: keyof T): T[keyof T];
    set(prop: keyof T, value: any): void;
    toObject(): T;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector<T>): void;
    setHost(host: EventTarget, eventType?: string): void;
}

export declare function createContext<T extends object>(root: T, manager: EffectsManager<T>): T;

export declare function createViewModel<T extends object>(init?: Partial<T>): ViewModel<T>;

export declare function css(template: TemplateStringsArray, ...params: string[]): CSSStyleSheet;

export declare function define(defns: ElementDefinitions): CustomElementRegistry;

export declare class DirectEffect<T extends object> implements Effect<T> {
    private effectFn;
    constructor(fn: Effector<T>);
    execute(scope: T): void;
}

export declare function discover<T extends object>(observer: Element, contextLabel: string): Promise<Provider<T>>;

export declare class Dispatch<Msg extends Base> extends CustomEvent<Msg> {
    constructor(msg: Msg, eventType?: string);
}

export declare const dispatch: (target: HTMLElement, ...msg: Base) => boolean;

declare const dispatch_2: (target: HTMLElement, ...msg: AuthMsg) => boolean;

export declare function dispatcher<Msg extends Base>(eventType?: string): (target: HTMLElement, ...msg: Msg) => boolean;

export declare interface DynamicDocumentFragment extends DocumentFragment {
}

export declare interface Effect<T extends object> {
    execute(scope: T): void;
}

export declare type Effector<T extends object> = (scope: T) => void;

declare type Effector_2<T extends object> = (site: Element, fragment: DocumentFragment, viewModel: Context<T>) => void;

export declare class EffectsManager<T extends object> {
    private signals;
    private running;
    private host?;
    private eventType;
    isRunning(): boolean;
    start(effect: Effect<T>): void;
    stop(): void;
    current(): Effect<T> | undefined;
    subscribe(key: keyof T): void;
    runEffects(key: keyof T, scope: T): void;
    setHost(host: EventTarget, eventType?: string): void;
}

export declare interface ElementContentPlace extends Place<"element content"> {
}

declare type ElementDefinitions = {
    [tag: string]: CustomElementConstructor;
};

declare type EventListener_2 = (ev: Event) => void;

declare type EventMap = {
    [key: string]: EventListener_2;
};

declare class FromAttributes<T extends object> implements Source<T> {
    subject: Element;
    constructor(subject: Element);
    start(fn: SourceEffect<T>): Promise<T>;
}

export declare function fromAttributes<T extends object>(subject: Element): FromAttributes<T>;

export declare function fromAuth(target: HTMLElement, contextLabel?: string): FromService<Auth_2.Model>;

declare class FromInputs<T extends object> implements Source<T> {
    subject: Node;
    constructor(subject: Node);
    start(fn: SourceEffect<T>): Promise<T>;
}

export declare function fromInputs<T extends object>(subject: Node): FromInputs<T>;

export declare class FromService<T extends object> implements Source<T> {
    private client;
    private observer;
    constructor(client: HTMLElement, contextLabel: string);
    start(fn: SourceEffect<T>): Promise<T>;
}

export declare function fromService<T extends object>(target: HTMLElement, contextLabel: string): FromService<T>;

export declare function html(template: TemplateStringsArray, ...params: Array<TemplateParameter>): DynamicDocumentFragment_2;

declare function html_2<T extends object>(template: TemplateStringsArray, ...params: Array<TemplateParameter | RenderFunction<T>>): ViewTemplate<T>;

export declare function identity<M>(model: M): M;

declare type KindOfPlace = "element content" | "attr value" | "tag content";

declare function map<T extends object>(view: ViewTemplate<T>, list: Array<T>): void[];

export declare type MapFn<M> = (model: M) => M;

declare namespace Message {
    export {
        dispatcher,
        Type,
        Base,
        Dispatch,
        dispatch
    }
}

export declare class Mutation {
    place: ReplacementPlace;
    constructor(place: ReplacementPlace);
    apply(_site: Element, _fragment: DynamicDocumentFragment): void;
}

declare type Place<K extends KindOfPlace> = {
    kind: K;
    nodeLabel: string;
};

export declare class Provider<T extends object> extends HTMLElement {
    readonly context: Context<T>;
    contextLabel: string;
    static DISCOVERY_EVENT: string;
    static CHANGE_EVENT: string;
    constructor(init: T, label: string);
    attach(observer: SignalReceiver<T>): T;
    detach(observer: SignalReceiver<T>): void;
}

export declare type RenderFunction<T extends object> = (data: T) => TemplateValue;

export declare function replace<M>(replacements: Partial<M>): MapFn<M>;

export declare interface Replacement {
    place: KindOfPlace;
    types: Array<string> | TypeCheckFunction;
    mutator(place: ReplacementPlace, value: TemplateParameter): Mutation;
}

declare type ReplacementPlace = ElementContentPlace | AttributeValuePlace | TagContentPlace;

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

export declare interface Source<T extends object> {
    start(fn: SourceEffect<T>): Promise<T>;
}

export declare type SourceEffect<T> = (name: keyof T, value: any) => void;

export declare class TagContentMutation extends Mutation {
    fn: TagMutationFunction;
    constructor(place: TagContentPlace, fn: TagMutationFunction);
    apply(site: Element): void;
}

export declare interface TagContentPlace extends Place<"tag content"> {
    tagName: string;
}

export declare type TagMutationFunction = (site: Element) => void;

export declare type TemplateParameter = TemplateValue | TemplatePlaceHolder;

export declare class TemplateParser {
    static parser: DOMParser;
    docType: DOMParserSupportedType;
    plugins: Array<TemplatePlugin>;
    constructor(docType?: DOMParserSupportedType);
    use(plugin: TemplatePlugin): void;
    parse(template: TemplateStringsArray, params: Array<TemplateParameter>): DynamicDocumentFragment;
    static OPEN_RE: RegExp;
    static IN_TAG_RE: RegExp;
    static ATTR_RE: RegExp;
    static CLOSE_RE: RegExp;
    classifyPlace(i: number, template: TemplateStringsArray): ReplacementPlace;
    tryReplacements(place: ReplacementPlace, param: TemplateParameter): Mutation | undefined;
    static basicReplacements: Array<Replacement>;
}

export declare interface TemplatePlaceHolder {
}

export declare interface TemplatePlugin {
    replacements: Array<Replacement>;
}

export declare type TemplateValue = string | number | boolean | object | Node;

declare function tokenPayload(user: APIUser | AuthenticatedUser): object;

export declare type Type<msg extends string, T extends object | undefined> = [msg, T] | [msg];

declare type TypeCheckFunction = (param: TemplateParameter, sub: Replacement) => boolean;

export declare type Update<Msg extends Message.Base, M extends object> = (message: Msg, apply: ApplyMap<M>) => Command<M> | void;

export declare const View: {
    apply: typeof apply;
    html: typeof html_2;
    map: typeof map;
};

export declare class ViewModel<T extends object> extends Context<T> {
    constructor(init: Partial<T>, adoptedContext?: Context<T>);
    html(template: TemplateStringsArray, ...params: Array<TemplateParameter | RenderFunction<T>>): DynamicDocumentFragment;
    merge<S extends object>(other: Partial<S>, source?: Source<S>): ViewModel<T & S>;
    render(view: ViewTemplate<T>): DynamicDocumentFragment;
}

export declare type ViewModelPlugin<T extends object> = (host: ViewModel<T>) => object;

export declare interface ViewTemplate<T extends object> extends DynamicDocumentFragment {
    render(context: Context<T>): DynamicDocumentFragment;
    effectors?: Map<string, Array<Effector_2<T>>>;
}

export { }
