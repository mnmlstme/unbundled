// module Kram_0dc8a6f0_webc (ES6)
          import { css, html, shadow } from '@un-bundled/unbundled'
          console.log('Loading module "Kram_0dc8a6f0_webc"')
          export function Program ({connectStore, initializeStore}) {
            // JS Definition from scene 1
class HelloWorldElement extends HTMLElement {
  constructor() {
    super();
    this.append(html` <h1>Hello, World</h1> `);
  }
}

// JS Definition from scene 1
customElements.define("hello-world", HelloWorldElement);

// JS Definition from scene 2
class HelloNameElement extends HTMLElement {
  get name() {
    return this.getAttribute("name") || "World";
  }

  constructor() {
    super();
    // This will not work:
    this.append(html` <h1>Hello, ${this.name}</h1> `);
  }

  connectedCallback() {
    this.replaceChildren(html` <h1>Hello, ${this.name}</h1> `);
  }
}

// JS Definition from scene 2
customElements.define("hello-name", HelloNameElement);

// JS Definition from scene 3
class HelloContentElement extends HTMLElement {
  static template = html`
    <template>
      <h1>Hello, <slot>there</slot>!</h1>
    </template>
  `;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      HelloContentElement.template.firstChild.content.cloneNode(true)
    );
  }
}

// JS Definition from scene 3
class HelloShadowElement extends HTMLElement {
  static template = html`
    <template>
      <h1>Hello, <slot>there</slot>!</h1>
    </template>
  `;

  constructor() {
    super();

    shadow(this).template(HelloShadowElement.template);
  }
}

// JS Definition from scene 3
customElements.define("hello-content", HelloShadowElement);

// JS Definition from scene 4
class HelloStyleElement extends HTMLElement {
  static template = html`
    <template>
      <h1>Hello, <slot>there</slot>!</h1>
    </template>
  `;

  static styles = css`
    :host {
      --image-max-height: calc(2 * var(--size-type-xxlarge));
    }

    h1 {
      display: flex;
      align-items: center;
      gap: var(--size-spacing-large);
      font-family: var(--font-family-display);
      font-size: var(--size-type-xxlarge);
      font-style: oblique;
      font-weight: var(--font-weight-bold);
      line-height: 1;
    }

    ::slotted(img) {
      max-height: var(--image-max-height);
    }
  `;

  constructor() {
    super();

    shadow(this)
      .template(HelloStyleElement.template)
      .styles(HelloStyleElement.styles);
  }
}

// JS Definition from scene 4
customElements.define("hello-style", HelloStyleElement);

// JS Definition from scene 5
class GreetWorldElement extends HTMLElement {
  constructor() {
    super();

    shadow(this)
      .template(GreetWorldElement.template)
      .styles(GreetWorldElement.styles);
  }

  static template = html`
    <template>
      <h1><slot name="greeting">Hello</slot>, <slot>there</slot>!</h1>
    </template>
  `;

  static styles = css`
    :host {
      --image-max-height: calc(2 * var(--size-type-xxlarge));
    }

    h1 {
      display: flex;
      align-items: center;
      gap: var(--size-spacing-large);
      font-family: var(--font-family-display);
      font-size: var(--size-type-xxlarge);
      font-style: oblique;
      font-weight: var(--font-weight-bold);
      line-height: 1;
    }

    ::slotted(img) {
      max-height: var(--image-max-height);
    }
  `;
}

// JS Definition from scene 5
customElements.define("greet-world", GreetWorldElement);

// JS Definition from scene 6
class ArrowButtonElement extends HTMLElement {
  static get observedAttributes() {
    return ["heading"];
  }

  constructor() {
    super();
    let content = document.getElementById("arrow-button-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    const heading = this.getAttribute("heading");

    if (heading) {
      this._updateRotation(heading);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "heading") {
      this._updateRotation(newValue);
    }
  }

  _updateRotation(heading) {
    const button = this.shadowRoot.firstElementChild;
    button.style.setProperty("--arrow-rotation", heading);
  }
}

customElements.define("arrow-button", ArrowButtonElement);

// JS Definition from scene 7
class DropdownElement extends HTMLElement {
  static template = html`<template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot>
        <menu>
          <li>Menu Item 1</li>
          <li>Menu Item 2</li>
          <li>Menu Item 3</li>
      </slot>
    </div>
  </template> `;

  static styles = css`
    :host {
      position: relative;
    }
    slot[name="actuator"] {
      cursor: pointer;
    }
    #panel {
      display: block;
      position: absolute;
      left: 0;
      margin-top: var(--size-spacing-small);
      width: max-content;
      transform: perspective(100vh) rotateX(-90deg);
      transform-origin: top center;
      padding: var(--size-spacing-small);
      border-radius: var(--size-radius-small);
      background: var(--color-background-card);
      color: var(--color-text);
      box-shadow: var(--shadow-popover);
      transition: transform 200ms;
    }
    :host([open]) #panel {
      transform: rotateX(0);
    }
  `;

  constructor() {
    super();

    shadow(this)
      .template(DropdownElement.template)
      .styles(DropdownElement.styles);
    this.shadowRoot
      .querySelector("slot[name='actuator']")
      .addEventListener("click", () => this.toggle());
    this.clickawayHandler = (ev) => {
      if (!ev.composedPath().includes(this)) {
        this.toggle(false);
      } else {
        ev.stopPropagation();
      }
    };
  }

  toggle() {
    if (this.hasAttribute("open")) this.removeAttribute("open");
    else this.setAttribute("open", "open");
  }

  static observedAttributes = ["open"];

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      if (oldValue === null && newValue !== null) {
        document.addEventListener("click", this.clickawayHandler);
      }
      if (oldValue !== null && newValue === null) {
        document.removeEventListener("click", this.clickawayHandler);
      }
    }
  }
}

customElements.define("drop-down", DropdownElement);

// JS Definition from scene 9
class DropdownBaseElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("dropdown-base-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
    this.isShownInput = this.shadowRoot.getElementById("is-shown");

    this.clickawayHandler = (ev) => {
      if (!ev.composedPath().includes(this)) {
        this.toggle(false);
      } else {
        ev.stopPropagation();
      }
    };

    this.isShownInput.addEventListener("change", () =>
      this.toggleClickAway(this.isShownInput.checked)
    );
  }

  toggle(open) {
    this.isShownInput.checked = open;
    this.toggleClickAway(open);
  }

  toggleClickAway(open) {
    if (open) {
      document.addEventListener("click", this.clickawayHandler);
    } else {
      document.removeEventListener("click", this.clickawayHandler);
    }
  }
}

customElements.define("dropdown-base", DropdownBaseElement);

// JS Definition from scene 10
class CommandMenuElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("command-menu-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

class CommandGroupElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("command-group-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("command-menu", CommandMenuElement);
customElements.define("command-group", CommandGroupElement);

// JS Definition from scene 11
class ActionItemElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("action-item-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("action-item", ActionItemElement);

// JS Definition from scene 12
class HtmlFragmentElement extends HTMLElement {
  connectedCallback() {
    const href = this.getAttribute("href");
    const open = this.hasAttribute("open");

    if (open) loadHTML(href, this);

    this.addEventListener("html-fragment:open", () => loadHTML(href, this));
  }
}

// JS Definition from scene 13
const parser = new DOMParser();

function prepareTemplate(htmlString) {
  const doc = parser.parseFromString(htmlString, "text/html");
  const content = doc.head.firstElementChild.content;

  return content;
}

            return ({
              
            })
          }
          export function mount (mountpoint, initial) {
            let Store = {
              root: Object.assign({}, initial),
            };
            const connectStore = (path = ["root"]) => {
              let root = Store;
              path.forEach((key) => root = root[key]);
              return ({
                root,
                get: (key) => root[key],
                set: (key, value) => root[key] = value,
                keys: () => Object.keys(root),
              })};
            const program = Program({connectStore})
            return (n, container) => {
              program[n-1].call(container)
            }
          }