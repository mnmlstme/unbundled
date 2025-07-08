export declare class Context<T extends object> {
    _proxy: T;
    constructor(init: T, host: HTMLElement);
    get value(): T;
    set value(next: T);
    apply(mapFn: (t: T) => T): void;
}

export declare function createContext<T extends object>(root: T, eventTarget: HTMLElement): T;

export declare function createObservable<T extends object>(root: T): T;

export declare function createViewModel<T extends object>(init?: T): ViewModel<T>;

declare interface DynamicDocumentFragment extends DocumentFragment {
}

declare type Effector<T> = (site: Element, fragment: DocumentFragment, viewModel: T) => void;

declare type Effector_2<T extends object> = (scope: T) => void;

declare class FromInputs<T extends object> implements Observer<T> {
    effectFn?: ObserverEffect<T>;
    constructor(subject: HTMLElement);
    setEffect(fn: ObserverEffect<T>): void;
}

export declare function fromInputs<T extends object>(subject: HTMLElement): FromInputs<T>;

declare function html<T extends object>(template: TemplateStringsArray, ...params: Array<TemplateParameter>): ViewTemplate<T>;

declare function map<T extends object>(view: ViewTemplate<T>, list: Array<T>): void[];

export declare interface Observer<T extends object> {
    setEffect(fn: ObserverEffect<T>): void;
}

export declare type ObserverEffect<T> = (name: keyof T, value: any) => void;

declare type TemplateParameter = TemplateValue | Function | TemplatePlaceHolder;

declare interface TemplatePlaceHolder {
}

declare type TemplateValue = string | number | boolean | object | Node;

export declare const View: {
    html: typeof html;
    map: typeof map;
};

export declare class ViewModel<T extends object> {
    object: T;
    proxy: T;
    constructor(init: T, adoptedProxy?: T);
    get(prop: keyof T): T[keyof T];
    set(prop: keyof T, value: any): void;
    toObject(): T;
    merge<S extends object>(other: S, observer?: Observer<S>): ViewModel<T & S>;
    createEffect(fn: Effector_2<T>): void;
    render(view: ViewTemplate<T>, scope?: T): void;
}

export declare type ViewModelPlugin<T extends object> = (host: ViewModel<T>) => object;

export declare interface ViewTemplate<T extends object> extends DynamicDocumentFragment {
    render(init: T): void;
    effectors?: Map<string, Array<Effector<T>>>;
}

export { }
