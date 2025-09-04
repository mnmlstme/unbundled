declare function apply<T extends object>(view: Template<[T]>, t: T | undefined): TemplateValue<[T]>;

declare function apply2<U extends object | undefined, V extends object | undefined>(view: Template<[U, V]>, u: U | undefined, v: V | undefined): TemplateValue<[U, V]>;

declare function applyN<TT extends TemplateArgs>(view: Template<TT>, ...tuple: TT): TemplateValue<TT>;

declare type ArrayArgs<TT extends TemplateArgs> = {
    [Index in keyof TT]: Array<TT[Index]>;
};

declare type BasicTemplateValue = string | number | boolean | Node | null;

export declare class Context<T extends object> {
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

export declare function createContext<T extends object>(root: T, manager: EffectsManager<T>): T;

export declare function createView<T extends object>(html: Template<[T]>): Template<[T]>;

export declare function createView2<U extends object | undefined, V extends object | undefined>(html: Template<[U, V]>): Template<[U, V]>;

export declare function createViewModel<T extends object>(init?: T): ViewModel<T>;

export declare function createViewN<TT extends TemplateArgs>(html: Template<TT>): Template<TT>;

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

declare class EffectsManager<T extends object> {
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

declare function map<T extends object>(view: Template<[T]>, list: Array<T>): TemplateValue<[T]>;

declare function map2<U extends object | undefined, V extends object | undefined>(view: Template<[U, V]>, ulist: Array<U>, vlist: Array<V>): TemplateValue<[U, V]>;

declare function mapN<TT extends TemplateArgs>(view: Template<TT>, ...lists: ArrayArgs<TT>): TemplateValue<TT>;

export declare type NameMapping<T extends object, S extends object> = {
    [K in keyof Partial<T>]: keyof Partial<S> | ((s: S) => T[K]);
};

declare type RenderFunction<TT extends TemplateArgs> = (...args: Scope<TT>) => DocumentFragment;

declare type Scope<TT extends EffectArgs_2> = {
    [Index in keyof TT]: TT[Index] extends object ? Context_2<TT[Index]> : object;
};

export declare interface Source<T extends object> {
    start(fn: SourceEffect<T>): Promise<Partial<T>>;
}

export declare type SourceEffect<T> = (name: keyof T, value: any) => void;

declare interface Template<TT extends TemplateArgs> extends DocumentFragment {
    render: RenderFunction<TT>;
}

declare type TemplateArgs = Array<object | undefined>;

declare type TemplateValue<TT extends TemplateArgs> = BasicTemplateValue | Template<TT> | Array<BasicTemplateValue | Template<TT>>;

export declare const View: {
    apply: typeof apply;
    apply2: typeof apply2;
    applyN: typeof applyN;
    map: typeof map;
    map2: typeof map2;
    mapN: typeof mapN;
};

export declare class ViewModel<T extends object> extends Context<T> {
    constructor(init: Partial<T>, adoptedContext?: Context<T>);
    get $(): Readonly<T>;
    merge<S extends object>(source: Source<S>, mapping: NameMapping<T, S> | Array<NameMapping<T, S> | (keyof T & keyof S)>): ViewModel<T>;
    render(template: Template<[T]>): DocumentFragment;
}

export { }
