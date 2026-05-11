declare class DropdownElement extends HTMLElement {
    static template: import('@unbndl/html').Template<import('@unbndl/html').TemplateArgs>;
    static styles: CSSStyleSheet;
    constructor();
    toggle(): void;
}
export { DropdownElement as Element };
