declare type BasicTemplateValue = string | number | boolean | Node | null;

declare class Context<T extends object> {
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

export declare function css(template: TemplateStringsArray, ...params: string[]): CSSStyleSheet;

export declare function define(defns: ElementDefinitions): CustomElementRegistry;

declare function delegate(element: Element | DocumentFragment, selector: string, map: EventMap): void;

declare interface Effect {
    execute(): void;
}

declare type EffectArgs = Array<object>;

declare type Effector<TT extends EffectArgs> = (...scope: TT) => void;

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

export declare function html<TT extends TemplateArgs>(template: TemplateStringsArray, ...params: Array<TemplateParameter<TT>>): Template<TT>;

/**
 * Memory leak warning!
 * Need to also clean up all the event listeners, probably
 * on disconnectCallback();
 */
declare function listen(element: Element | DocumentFragment, map: EventMap): void;

declare type Scope<TT extends EffectArgs> = {
    [Index in keyof TT]: Context<TT[Index]>;
};

export declare function shadow(el: HTMLElement, options?: ShadowRootInit): {
    template: (fragment: DocumentFragment) => /*elided*/ any;
    styles: (...sheets: CSSStyleSheet[]) => /*elided*/ any;
    replace: (fragment: DocumentFragment) => /*elided*/ any;
    root: ShadowRoot;
    delegate: (selector: string, map: EventMap) => /*elided*/ any;
    listen: (map: EventMap) => /*elided*/ any;
};

export declare type Template<TT extends TemplateArgs> = (...args: Scope<TT>) => DocumentFragment;

export declare type TemplateArgs = Array<object>;

export declare type TemplateEffect<TT extends TemplateArgs> = (...args: TT) => TemplateValue;

export declare type TemplateParameter<TT extends TemplateArgs> = TemplateValue | TemplateEffect<TT> | TemplateReferenceEffect<TT>;

export declare type TemplateReferenceEffect<TT extends TemplateArgs> = (ref: Element, ...args: TT) => void;

export declare type TemplateValue = BasicTemplateValue | Array<BasicTemplateValue>;

export { }
