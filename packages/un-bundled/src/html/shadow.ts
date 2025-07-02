export function shadow(
  el: HTMLElement,
  options: ShadowRootInit = { mode: "open" }
) {
  const shadowRoot = el.shadowRoot || el.attachShadow(options);
  const chain = { template, styles, replace };

  return chain;

  function template(fragment: DocumentFragment) {
    const first = fragment.firstElementChild;
    const template =
      first && first.tagName === "TEMPLATE"
        ? (first as HTMLTemplateElement)
        : undefined;

    if (template) {
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    return chain;
  }

  function styles(...sheets: CSSStyleSheet[]) {
    shadowRoot.adoptedStyleSheets = sheets;

    return chain;
  }

  function replace(fragment: DocumentFragment) {
    shadowRoot.replaceChildren(fragment);
    return chain;
  }
}
