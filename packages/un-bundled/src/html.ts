const parser = new DOMParser();

export function html(
  template: TemplateStringsArray,
  ...params: string[]
): DocumentFragment {
  const htmlString = template
    .map((s, i) => (i ? [params[i - 1], s] : [s]))
    .flat()
    .join("");
  const doc = parser.parseFromString(htmlString, "text/html");
  const collection = doc.head.childElementCount
    ? doc.head.children
    : doc.body.children;
  const fragment = new DocumentFragment();

  fragment.replaceChildren(...collection);

  return fragment;
}
