declare function apply<T extends object>(view: ViewTemplate<T>, $: T | undefined): "" | DynamicDocumentFragment;

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

declare class Context_2<T extends object> {
    private manager;
    private object;
    private proxy;
    static CHANGE_EVENT_TYPE: string;
    constructor(init: T, adoptedContext?: Context_2<T>);
    get(prop: keyof T): T[keyof T];
    set(prop: keyof T, value: any): void;
    toObject(): T;
    update(next: Partial<T>): void;
    apply(mapFn: (t: T) => Partial<T>): void;
    createEffect(fn: Effector_2<T>): void;
    setHost(host: EventTarget, eventType?: string): void;
}

export declare function createContext<T extends object>(root: T, manager: EffectsManager<T>): T;

export declare function createView<T extends object>(html: ViewTemplate<T>): ViewTemplate<T>;

export declare function createViewModel<T extends object>(init?: T): ViewModel<T>;

declare interface DynamicDocumentFragment extends DocumentFragment {
}

declare interface DynamicDocumentFragment_2 extends DocumentFragment {
}

declare interface Effect<T extends object> {
    execute(scope: T): void;
}

declare type Effector<T extends object> = (scope: T) => void;

declare type Effector_2<T extends object> = (scope: T) => void;

declare type Effector_3<T extends object> = (site: Element, fragment: DocumentFragment, viewModel: Context_2<T>) => void;

declare class EffectsManager<T extends object> {
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

declare class FromAttributes<T extends object> implements Source<T> {
    subject: Element;
    constructor(subject: Element);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare function fromAttributes<T extends object>(subject: Element): FromAttributes<T>;

declare class FromInputs<T extends object> implements Source<T> {
    subject: Node;
    constructor(subject: Node);
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare function fromInputs<T extends object>(subject: Node): FromInputs<T>;

declare function html<T extends object>(template: TemplateStringsArray, ...params: Array<TemplateParameter | RenderFunction<T>>): ViewTemplate<T>;

declare function map<T extends object>(view: ViewTemplate<T>, list: Array<T>): DynamicDocumentFragment[];

export declare type RenderFunction<T extends object> = (data: T, el: Element) => TemplateValue;

export declare interface Source<T extends object> {
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare type SourceEffect<T> = (name: keyof T, value: any) => void;

declare type TemplateParameter = TemplateValue | TemplatePlaceHolder;

declare interface TemplatePlaceHolder {
}

declare type TemplateValue = string | number | boolean | object | Node;

export declare const View: {
    apply: typeof apply;
    html: typeof html;
    map: typeof map;
};

export declare class ViewModel<T extends object> extends Context<T> {
    constructor(init: Partial<T>, adoptedContext?: Context<T>);
    get $(): T;
    merge<S extends object>(more: Partial<T> & Partial<S>, source?: Source<S>): ViewModel<T>;
    render(view: ViewTemplate<T>): DynamicDocumentFragment_2;
}

export declare type ViewModelPlugin<T extends object> = (host: ViewModel<T>) => object;

export declare interface ViewTemplate<T extends object> extends DynamicDocumentFragment {
    render(context: Context_2<T>): DynamicDocumentFragment;
    effectors?: Map<string, Array<Effector_3<T>>>;
}

export { }
