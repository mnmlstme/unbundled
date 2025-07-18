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

export declare class DirectEffect<T extends object> implements Effect<T> {
    private effectFn;
    constructor(fn: Effector<T>);
    execute(scope: T): void;
}

export declare interface Effect<T extends object> {
    execute(scope: T): void;
}

export declare type Effector<T extends object> = (scope: T) => void;

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

export declare type Signal<T, K extends keyof T> = {
    property: K;
    value: T[K];
};

export declare class SignalEvent<T, K extends keyof T> extends CustomEvent<Signal<T, K>> {
    constructor(eventType: string, signal: Signal<T, K>);
}

export declare type SignalReceiver<T> = (ev: SignalEvent<T, keyof T>) => void;

export { }
