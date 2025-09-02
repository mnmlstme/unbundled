import { TemplateArgs } from "./template";
import { MutationEffect, MutationEffectMap } from "./mutation";
import { Scope } from "../effects";

export function renderForEffects<TT extends TemplateArgs>(
  fragment: DocumentFragment,
  effectors: MutationEffectMap<TT>,
  ...scope: Scope<TT>
): DocumentFragment {
  // console.log("Rendering for effects:", fragment);
  effectors.forEach((list: Array<MutationEffect<TT>>) => {
    list.forEach((fn) => fn(...scope));
  });
  return fragment;
}
