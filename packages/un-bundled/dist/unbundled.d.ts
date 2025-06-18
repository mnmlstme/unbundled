export declare function cloneTemplate(view: ViewTemplate): ViewTemplate;

export declare function css(template: TemplateStringsArray, ...params: string[]): CSSStyleSheet;

export declare function define(defns: ElementDefinitions): CustomElementRegistry;

declare type ElementDefinitions = {
    [tag: string]: CustomElementConstructor;
};

export declare function html(template: TemplateStringsArray, ...values: unknown[]): ViewTemplate;

export declare class HtmlEffect extends HTMLElement {
    effect: ViewFn;
    constructor(viewFn: ViewFn);
    setEffect(effect: ViewFn): void;
    setEffectId(hash: string): void;
    getEffectId(): string | undefined;
}

export declare function shadow(el: HTMLElement, options?: ShadowRootInit): {
    template: (fragment: DocumentFragment) => any;
    styles: (...sheets: CSSStyleSheet[]) => any;
    replace: (fragment: DocumentFragment) => any;
};

export declare type ViewFn = ($: object) => DocumentFragment;

export declare interface ViewTemplate extends DocumentFragment {
    effects: {
        [hash: string]: ViewFn;
    };
}

export { }
