export declare function css(template: TemplateStringsArray, ...params: string[]): CSSStyleSheet;

export declare function define(defns: ElementDefinitions): CustomElementRegistry;

declare type ElementDefinitions = {
    [tag: string]: CustomElementConstructor;
};

export declare function html(template: TemplateStringsArray, ...values: unknown[]): DocumentFragment;

export declare function shadow(el: HTMLElement, options?: ShadowRootInit): {
    template: (fragment: DocumentFragment) => any;
    styles: (...sheets: CSSStyleSheet[]) => any;
    replace: (fragment: DocumentFragment) => any;
};

export { }
