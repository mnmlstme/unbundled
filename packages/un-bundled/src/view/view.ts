import { Template, TemplateArgs, TemplateValue } from "../html";
import { createScope } from "../effects";

export function createView<TT extends TemplateArgs>(
  html: Template<TT>
) {
  return html;
}

type ArrayArgs<TT extends TemplateArgs> = {
  [Index in keyof TT]: Array<TT[Index]>;
};

function zipArgs<TT extends TemplateArgs>(
  ...lists: ArrayArgs<TT>
): Array<TT> {
  const maxLength = lists
    .map((arr) => arr.length)
    .reduce((a, b) => Math.max(a, b), 0);
  const range = Array.from(Array(maxLength).keys());
  return range.map((i) => lists.map((arr) => arr[i]) as TT);
}

export function map<TT extends TemplateArgs>(
  view: Template<TT>,
  ...lists: ArrayArgs<TT>
): TemplateValue {
  if (!lists.length) return "";

  return zipArgs<TT>(...lists)
    .map((tuple: TT) => apply(view, tuple))
    .flat();
}

export function apply<TT extends TemplateArgs>(
  view: Template<TT>,
  tuple: TT | undefined
): TemplateValue {
  // console.log("Applying viewmodel", $);
  if (!tuple) return "";
  const scope = createScope(tuple);
  return view(...scope);
}
