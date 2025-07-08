export declare function createEffect<T extends object>(fn: Effector<T>, initialScope: T): void;

export declare interface Effect<T extends object> {
    execute(scope: T): void;
}

export declare type Effector<T extends object> = (scope: T) => void;

export declare class EffectsManager<T extends object> {
    signals: Map<string, Set<Effect<T>>>;
    subscribe(key: string): void;
    runEffects(key: string, scope: T): void;
}

export { }
