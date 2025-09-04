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

export declare function createContext<T extends object>(root: T, manager: EffectsManager<T>): T;

export declare function createEffect<TT extends EffectArgs>(fn: Effector<TT>, ...scope: Scope<TT>): void;

export declare function createScope<TT extends EffectArgs>(tuple: TT): Scope<TT>;

export declare class DirectEffect<TT extends EffectArgs> implements Effect {
    private effectFn;
    constructor(fn: Effector<TT>, ...scope: TT);
    execute(): void;
}

export declare interface Effect {
    execute(): void;
}

export declare type EffectArgs = Array<object | undefined>;

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

export declare function exposeTuple<TT extends EffectArgs>(scope: Scope<TT>): TT;

export declare class Scheduler {
    private signals;
    private scheduled;
    static scheduler: Scheduler;
    subscribe<T extends object>(scope: T, key: keyof T, effect: Effect): void;
    scheduleEffects<T extends object>(scope: T, key: keyof T): void;
}

export declare type Scope<TT extends EffectArgs> = {
    [Index in keyof TT]: TT[Index] extends object ? Context<TT[Index]> : object;
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

export { }
