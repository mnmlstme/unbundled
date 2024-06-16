export declare function html(template: TemplateStringsArray, ...params: string[]): DocumentFragment;

export declare function shadow(fragment: DocumentFragment): {
    attach: (el: HTMLElement, options?: ShadowRootInit) => ShadowRoot;
};

export { }
