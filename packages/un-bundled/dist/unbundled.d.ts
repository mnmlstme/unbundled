export declare function css(template: TemplateStringsArray, ...params: string[]): CSSStyleSheet;

export declare function html(template: TemplateStringsArray, ...params: string[]): DocumentFragment;

export declare function shadow(el: HTMLElement, options?: ShadowRootInit): {
    template: (fragment: DocumentFragment) => any;
    styles: (...sheets: CSSStyleSheet[]) => void;
};

export { }
