const parser = new DOMParser();
function html(template, ...params) {
  const htmlString = template.map((s, i) => i ? [params[i - 1], s] : [s]).flat().join("");
  const doc = parser.parseFromString(htmlString, "text/html");
  const collection = doc.head.childElementCount ? doc.head.children : doc.body.children;
  const fragment = new DocumentFragment();
  fragment.replaceChildren(...collection);
  return fragment;
}

// module Kram_4f44e823_webc (ES6)
          console.log('Loading module "Kram_4f44e823_webc"');
          function Program ({connectStore, initializeStore}) {
            // JS Definition from scene 1
class HelloWorldElement extends HTMLElement {
  constructor() {
    super();
    this.replaceChildren(html` <h1>Hello, World</h1> `);
  }
}

// JS Definition from scene 1
customElements.define("hello-world", HelloWorldElement);

// JS Definition from scene 3
class HelloStyleElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("hello-style-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("hello-style", HelloStyleElement);

// JS Definition from scene 4
class GreetWorldElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("greet-world-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("greet-world", GreetWorldElement);

// JS Definition from scene 5
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

// JS Definition from scene 6
const parser = new DOMParser();

function prepareTemplate(htmlString) {
  const doc = parser.parseFromString(htmlString, "text/html");
  const content = doc.head.firstElementChild.content;

  return content;
}

// JS Definition from scene 6
class V1DropdownElement extends HTMLElement {
  static template = prepareTemplate(`<template>
      <slot name="actuator"><button> Menu </button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;
          position: absolute;
          left: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
        ::slotted(menu) {
          list-style: none;
        }
      </style>
    </template>`);

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).appendChild(
      V1DropdownElement.template.cloneNode(true)
    );
    this.shadowRoot
      .querySelector("slot[name='actuator']")
      .addEventListener("click", () => this.toggle());
  }

  toggle() {
    if (this.hasAttribute("open")) this.removeAttribute("open");
    else this.setAttribute("open", "open");
  }
}

customElements.define("dropdown-menu", V1DropdownElement);

// JS Definition from scene 8
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

// JS Definition from scene 9
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

// JS Definition from scene 10
class ActionItemElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("action-item-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("action-item", ActionItemElement);

            return ({
              
            })
          }
          function mount (mountpoint, initial) {
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
            const program = Program({connectStore});
            return (n, container) => {
              program[n-1].call(container);
            }
          }

export { Program, mount };
