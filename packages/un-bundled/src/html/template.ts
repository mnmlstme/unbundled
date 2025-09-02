import { Scope } from "../effects";

export type TemplateArgs = Array<object>;

export type Template<TT extends TemplateArgs> = (
  ...args: Scope<TT>
) => DocumentFragment;

type BasicTemplateValue =
  | string
  | number
  | boolean
  | Node
  | null;

export type TemplateValue =
  | BasicTemplateValue
  | Array<BasicTemplateValue>;

export type TemplateEffect<TT extends TemplateArgs> = (
  ...args: TT
) => TemplateValue;

export type TemplateReferenceEffect<TT extends TemplateArgs> = (
  ref: Element,
  ...args: TT
) => void;

export type TemplateParameter<TT extends TemplateArgs> =
  | TemplateValue
  | TemplateEffect<TT>
  | TemplateReferenceEffect<TT>;
