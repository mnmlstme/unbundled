import { DynamicDocumentFragment as DynamicDocumentFragment_2 } from './template.ts';

export declare interface AttributeValuePlace extends Place<"attr value"> {
    tagName: string;
    attrName: string;
}

export declare function css(template: TemplateStringsArray, ...params: string[]): CSSStyleSheet;

export declare function define(defns: ElementDefinitions): CustomElementRegistry;

export declare interface DynamicDocumentFragment extends DocumentFragment {
}

export declare interface ElementContentPlace extends Place<"element content"> {
}

declare type ElementDefinitions = {
    [tag: string]: CustomElementConstructor;
};

declare type EventListener_2 = (ev: Event) => void;

declare type EventMap = {
    [key: string]: EventListener_2;
};

export declare function html(template: TemplateStringsArray, ...params: Array<TemplateParameter>): DynamicDocumentFragment_2;

declare type KindOfPlace = "element content" | "attr value" | "tag content";

export declare class Mutation {
    place: ReplacementPlace;
    constructor(place: ReplacementPlace);
    apply(_site: Element, _fragment: DynamicDocumentFragment): void;
}

declare type Place<K extends KindOfPlace> = {
    kind: K;
    nodeLabel: string;
};

export declare interface Replacement {
    place: KindOfPlace;
    types: Array<string> | TypeCheckFunction;
    mutator(place: ReplacementPlace, value: TemplateParameter): Mutation;
}

declare type ReplacementPlace = ElementContentPlace | AttributeValuePlace | TagContentPlace;

export declare function shadow(el: HTMLElement, options?: ShadowRootInit): {
    template: (fragment: DocumentFragment) => /*elided*/ any;
    styles: (...sheets: CSSStyleSheet[]) => /*elided*/ any;
    replace: (fragment: DocumentFragment) => /*elided*/ any;
    root: ShadowRoot;
    delegate: (selector: string, map: EventMap) => /*elided*/ any;
    listen: (map: EventMap) => /*elided*/ any;
};

export declare class TagContentMutation extends Mutation {
    fn: TagMutationFunction;
    constructor(place: TagContentPlace, fn: TagMutationFunction);
    apply(site: Element): void;
}

export declare interface TagContentPlace extends Place<"tag content"> {
    tagName: string;
}

export declare type TagMutationFunction = (site: Element) => void;

export declare type TemplateParameter = TemplateValue | TemplatePlaceHolder;

export declare class TemplateParser {
    static parser: DOMParser;
    docType: DOMParserSupportedType;
    plugins: Array<TemplatePlugin>;
    constructor(docType?: DOMParserSupportedType);
    use(plugin: TemplatePlugin): void;
    parse(template: TemplateStringsArray, params: Array<TemplateParameter>): DynamicDocumentFragment;
    static OPEN_RE: RegExp;
    static IN_TAG_RE: RegExp;
    static ATTR_RE: RegExp;
    static CLOSE_RE: RegExp;
    classifyPlace(i: number, template: TemplateStringsArray): ReplacementPlace;
    tryReplacements(place: ReplacementPlace, param: TemplateParameter): Mutation | undefined;
    static basicReplacements: Array<Replacement>;
}

export declare interface TemplatePlaceHolder {
}

export declare interface TemplatePlugin {
    replacements: Array<Replacement>;
}

export declare type TemplateValue = string | number | boolean | object | Node;

declare type TypeCheckFunction = (param: TemplateParameter, sub: Replacement) => boolean;

export { }
