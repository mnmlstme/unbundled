export function shadow(fragment: DocumentFragment) {
  const first = fragment.firstElementChild;
  const template =
    first && first.tagName === "TEMPLATE"
      ? (first as HTMLTemplateElement)
      : undefined;

  return { attach };

  function attach(el: HTMLElement, options: ShadowRootInit = { mode: "open" }) {
    const shadow = el.attachShadow(options);

    if (template) shadow.appendChild(template.content.cloneNode(true));

    return shadow;
  }
}
