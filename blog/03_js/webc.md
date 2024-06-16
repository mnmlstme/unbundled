---
title: Web Components
platform: web-standard
imports:
  - from: "@un-bundled/unbundled"
    expose:
      - html
---

```html
<hello-world></hello-world>
```

# Hello, world

Here is "Hello, world" implemented as a web component.
Notice that all we need to do is reference the `<hello-world>` element in our HTML.

But… _searches HTML standard…_ where did this new `<hello-world>` element come from?
And why does it have a hyphen in the name?

The answer is that we've defined an HTML
[custom element](https://html.spec.whatwg.org/multipage/custom-elements.html)
and all custom elements are required to contain a hyphen in the name.
This is to ensure that custom element names do not conflict with yet-to-be-defined HTML tags in the future.

How does the browser know what to do when we use `<hello-world>` in
our HTML?
We tell it by defining a class which extends the base class of all
HTML elements, `HTMLElement`:

```js
class HelloWorldElement extends HTMLElement {
  constructor() {
    super();
    this.replaceChildren(html` <h1>Hello, World</h1> `);
  }
}
```

One last thing we need to do is to let the browser know that this
class should be used whenever the `hello-world` tag name is given:

```js
customElements.define("hello-world", HelloWorldElement);
```

## Shadow DOM and template

We define a custom element in HTML using the `<template>` HTML element.
Inside the template we put whatever HTML we want to have inserted whenever the custom element is used.

```html
<template id="hello-world-template">
  <h1>Hello, <slot>world</slot>!</h1>
</template>
```

There's one more thing we need, and that is to bind our template to the tag name `hello-world` by
registering a Javascript `class` and attaching our template in its `constuctor`.

---

# Slots

```html
<hello-world> web components </hello-world>
```

Notice that the template for `<hello-world>` includes `<slot>` markup.
Slots allow us to swap out different content each time the component is used.
In this case, the `<slot>` contains the word "world", so we can use this same
template to say hello to anything.

A slot can be thought of as a parameter to the component.
Every time we use the component, we can assign a different value to the slot
by putting that value in the body of the component.

---

# Styling the template

```html
<hello-style> component style </hello-style>

<h1>This &lt;H1&gt; has no style</h1>
```

By inserting a `<style>` element inside our template, we can apply CSS to elements
in the template without affecting anything outside our component.

```html
<template id="hello-style-template">
  <h1>Hello, <slot class="fancy">world</slot>!</h1>

  <style>
    h1 {
      font: var(--size-type-xlarge) var(--font-family-display);
    }

    .fancy {
      font-family: var(--font-family-body);
      font-style: italic;
      color: var(--color-accent);
    }
  </style>
</template>
```

Remember, every time we define a new component, we need this boilerplate:

```js
class HelloStyleElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("hello-style-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("hello-style", HelloStyleElement);
```

---

# Named Slots

```html
<greet-world>
  <span slot="greeting">Greetings</span>
  <span slot="recipient">earthlings</span>
</greet-world>
```

Just as a function can have more than one parameter,
a component template can contain more than one `<slot>`.
To distinguish between multiple slots, the slots need to have a `name` attribute.

```html
<template id="greet-world-template">
  <h1>
    <slot name="greeting">Hello</slot>, <slot name="recipient">world</slot>!
  </h1>

  <style>
    h1 {
      font-family: Georgia;
      font-size: 6rem;
    }

    slot[name="recipient"] {
      font-style: italic;
      color: darkorange;
    }
  </style>
</template>
```

To assign content to a named slot, we need to put it in an element that has a `slot` attribute.
The value of the `slot` attribute needs to match the `name` attribute of a slot
in the template.
There can be at most one unnamed slot in a template definition.
Any untagged text, or elements with no `slot` attribute, will be added to
the unnamed slot, it it exists.

We are using `<span>` for the slot value, because the `<slot>` occurs in the middle of text.
Using something other than a span may change the styling or even result in invalid markup.

```js
class GreetWorldElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("greet-world-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("greet-world", GreetWorldElement);
```

---

# Custom Attributes

```html
<arrow-button></arrow-button>
<arrow-button heading="90deg"></arrow-button>
<arrow-button heading="180deg"></arrow-button>
<arrow-button heading="-90deg"></arrow-button>
<arrow-button heading="45deg"></arrow-button>
```

Components can be defined to accept attributes, even attributes
that do not exist in standard HTML5.

```html
<template id="arrow-button-template">
  <button>
    <svg viewBox="0 0 24 24">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.5 10.4853L11.9853 2L20.4706 10.4853L17.9706 12.9853L14 9.01472V22H10V8.98528L6 12.9853L3.5 10.4853Z"
      /></svg
    ><slot></slot>
  </button>

  <style>
    svg {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      fill: currentColor;
      transform: rotate(var(--arrow-rotation, 0));
    }
  </style>
</template>
```

Here we are using the CSS `transform` property to rotate the arrow icon.
On the CSS for our component, we've defined a custom property `--arrow-rotation`
and then referenced that in the CSS rule for the `svg`.
The last step is to copy the value of the `heading` attribute into the
`--arrow-rotation` property.
This cannot be done in the template, so we have to add some code to the
Javascript class that defines our custom element.

We already have written the `constructor` for that class, but there is no
way to access the host element's attributes from the constructor.
Instead we need to use the _lifecycle callbacks_ that are provided to
us by the Web Components API.

```js
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
```

The `connectedCallback` function is invoked each time the custom element
is connected to a host element. In a static page, this will happen only once.
But if the DOM is being manipulated such that the host element is moved,
`connectedCallback` will be called again.
Because `connectedCallback` is a member function of our custom element
class, it can access the host element via `this`.

---

# An Interactive Component

```html
<section>
  <nav class="menu-bar">
    <dropdown-menu open>
      <span slot="actuator">File</span>
      <menu>
        <li>New…</li>
        <li><hr /></li>
        <li>Open…</li>
        <li>Open Recent</li>
        <li><hr /></li>
        <li>Save</li>
        <li>Save As…</li>
        <li>Revert to Last Saved</li>
        <li><hr /></li>
        <li>Close</li>
      </menu>
    </dropdown-menu>
    <dropdown-menu> <span slot="actuator"> Edit </span> </dropdown-menu>
    <dropdown-menu> <span slot="actuator"> View </span></dropdown-menu>
    <dropdown-menu> <span slot="actuator"> Help </span></dropdown-menu>
  </nav>
</section>
```

We can define a component in HTML, and style it with CSS, but to be really useful, our component needs the ability to do something. We need to implement some interactions, and to do that, we will need Javascript.

Let's implement a dropdown menu, like the **File** menu in most desktop applications.
There are two parts to the dropdown component:

1. an _actuator_ which identifies the menu and provides an affordance for the user to open it, and
2. the _menu_ itself, a list of actions from which the user may select.

So our component will have two slots.
The _menu_ content will always require markup, so we will make it
a named slot. Since the _actuator_ will often be untagged text, which makes it a good choice for
the unnamed slot.

First, we'll define a template, and some styling to handle hiding and revealing the menu. We'll use a checkbox to maintain the open/closed state, and wrapping the `<label>` for the checkbox around the actuator will allow it to control the open/closed state. No Javascript is required here.

```js
const parser = new DOMParser();

function prepareTemplate(htmlString) {
  const doc = parser.parseFromString(htmlString, "text/html");
  const content = doc.head.firstElementChild.content;

  return content;
}
```

The logic for closing the menu when the user clicks outside the menu can be applied from the component's constructor, since we have a `this` handle.

```js
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
```

```html
<template>
  <slot name="actuator"><button>Menu</button></slot>
  <div id="panel">
    <slot></slot>
  </div>
  <style>
    /* CSS */
  </style>
</template>
```

```css
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
```

Whenever the user clicks outside of our component, we want to close the menu.
Since all clicks on the page eventually propagate up to the document element,
we can listen for `"click"` events on `document`.
But clicks within our component will also propagate to `document`.
To check whether the event came from somewhere inside the component, we get the `composedPath`
of the event and check whether it includes our component.

If the click came from outside our component, we will close the menu by setting
`checked = false` on the checkbox.
Notice that since the `<input>` is in the shadow DOM, we need to access it via `this.shadowRoot`.
We put this line of code in a separate member function `toggle(open)` because keeps our constructor tidy.
It also gives us a head start on an API for our dropdown element.
In a bit, we'll be glad to have only one place where all the state changes take place.

Now that we've coded our `"click"` event listener, we need to make sure it gets added to (and removed from) `document` at the appropriate times.
Essentially, we need to synchronize the addition and removal of the listener with the state of the menu, which is maintained in our checkbox.
To make sure we understand all the possible ways the state of the dropdown can change
let's enumerate them:

1. The user clicks on the actuator
2. The user clicks away from an open dropdown
3. The `toggle()` method is called

This gives us only three places where we need to ensure the listener and the dropdown are in sync.
Since we implemented click-away to call `toggle()`, we don't need to consider case 2 separately.

Let's start with case 1.
When the user clicks on the actuator, the browser toggles the state of the checkbox, which then causes the menu to appear because of the CSS `:checked` selector.
There is no Javascript required to implement this interaction.
So we need to add another event listener to make our component aware of the checkbox state changes.

To address case 1, we need to listen for `"change"` events on the checkbox.
We set up this event listener in the constructor.
The handler needs to call `addEventListener` or `removeEventListener` depending on the current state of the checkbox.
In the interest of localizing all the event listener code, we implement a single function,
`toggleClickAway(open)`, which will add or remove the listener depending on whether the `open` argument is `true` or `false`.

Finally, we handle case 3 (as well as case 2) by calling `toggleClickAway`
with the same value that's passed to `toggle`.

---

# Styling Slotted Content

You may have noticed that a fair amount of the CSS for `dropdown-menu` uses the `::slotted` pseudo-element, paired with selectors that target the `slot` element in the template.
The `::slotted` pseudo-element allows a component's CSS to target elements which are
outside the shadow DOM, as long as they have been slotted into the component.
And the paired selectors target the slots and the default content they contain.

Or you may have been concerned that we rely on the menu slot being filled by a `<ul>`.
What if we gave it a `<table>` instead? And what if we wanted to style the actuator differently?

While the `::slotted` pseudo-element has legitimate uses, here is is being used to overstep the
boundaries of the component. This violates [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns) and [Single-Responsibility Principle](https://en.wikipedia.org/wiki/Single-responsibility_principle).

Let's see how we can solve these problems before adding more functionality to `dropdown-menu`.

---

# Composable Components

```html
<section>
  <nav class="menu-bar">
    <dropdown-base>
      File
      <command-menu slot="layer">
        <action-item>New…</action-item>
        <command-group>
          <action-item>Open…</action-item>
          <action-item>Open Recent</action-item>
        </command-group>
        <command-group>
          <action-item>Save</action-item>
          <action-item>Save As…</action-item>
          <action-item>Revert to Last Saved</action-item>
        </command-group>
        <action-item>Close</action-item>
      </command-menu>
    </dropdown-base>
    <dropdown-base>Edit</dropdown-base>
    <dropdown-base>View</dropdown-base>
    <dropdown-base>Help</dropdown-base>
  </nav>
</section>
```

Our dropdown component should make as few assumptions about what elements are used to fill the slots. Its sole responsibility is to open and close the dropdown.

Let's refactor `dropdown-menu` to address these concerns, and make our dropdown component more
versatile at the same time.
The key abstraction that dropdown implements is, well, the dropping-down of some previously hidden UI.

Our first usage of this abstraction is for dropdown menus from a menubar. But the same idea (and code)
pertains to a preview image dropping down from a thumbnail, or an info card dropping down from a user's avatar.
We can imagine creating the components `<preview-image>`, `<info-card>` as well as `<command-menu>`
being able to use our `dropdown-base` with any of them.

What other ways could we can make `dropdown-menu` more general? Does the user have to click on the actuator? Maybe they should be able to swipe? And what if we need the content to pop up instead of
dropping down?

These are all valid options when thinking about refactoring our dropdown.
If we carefully separate concerns we can design a set of components that can be put together,
or _composed_, in many different ways.
Instead of allowing just one dropdown, which can only be used in a menu bar, we can provide
a set of interchangeable parts, implementing a multitude of scenarios.
What's, more the resulting system is easily extensible, and its capabilities grow
combinatorially as more components are added.

Let's design a `<command-menu>` component and refactor `<dropdown-menu>`` to delegate the relevant responsibilities to the new component. We'll start by renaming the elements in our dropdown menu example to better reflect the responsibilities of each.

```html
<template id="dropdown-base-template">
  <input type="checkbox" id="is-shown" />
  <label for="is-shown">
    <slot><button onclick="() => null">Menu</button></slot>
  </label>
  <div id="layer">
    <slot name="layer">
      <command-menu>
        <action-item>Action Item 1</action-item>
        <action-item>Action Item 2</action-item>
        <action-item>Action Item 3</action-item>
      </command-menu>
    <slot>
  </div>

  <style>
    :host {
      position: relative;
    }

    #is-shown {
      display: none;
    }

    #layer {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
    }

    #is-shown:checked ~ #layer {
      display: block;
    }
  </style>
</template>
```

```js
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
```

---

# List-like Components

The `<command-menu>` component can be used as a dropdown menu, a sidebar menu, etc.
A `<command-group>` allows similar menu options to be grouped together, and separated
from the rest by a divider.

```html
<template id="command-menu-template">
  <menu>
    <slot>
      <action-item>Menu Item 1</action-item>
      <action-item>Menu Item 2</action-item>
      <action-item>Menu Item 3</action-item>
    </slot>
  </menu>

  <style>
    menu {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0.5em;
      gap: 0.25em;
      list-style: none;
      border: 1px solid;
    }
  </style>
</template>

<template id="command-group-template">
  <hr id="top-hr" />
  <ul>
    <slot>
      <action-item>Group Item 1</action-item>
      <action-item>Group Item 2</action-item>
      <action-item>Group Item 3</action-item>
    </slot>
  </ul>
  <hr />

  <style>
    :host {
      --command-group-display-top-hr: block;
    }

    hr {
      margin: 0 -0.5em 0.25em;
    }

    #top-hr {
      display: var(--command-group-display-top-hr);
    }

    ul {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0 0 0.25em;
      gap: 0.25em;
      list-style: none;
    }
  </style>
</template>
```

```css
command-group + command-group {
  --command-group-display-top-hr: none;
}
```

```js
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
```

---

# Components that handle events

```html
<format-data name="count">The count is {count}.</format-data>
<action-item>↑</action-item>
<action-item>↓</action-item>
<action-item>Reset</action-item>
```

The `<action-item>` component was originally designed to be an item in a command menu. It's not called `command-item` because it should work for more than commands.
`<action-item>` is meant to be composable, or even used alone.

```html
<template id="action-item-template">
  <button>
    <slot>Some Action</slot>
  </button>
  <style>
    button {
      white-space: nowrap;
      color: inherit;
      text-decoration: none;
      cursor: pointer;
    }
  </style>
</template>
```

```js
class ActionItemElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("action-item-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("action-item", ActionItemElement);
```

---

## You may not need the ShadowDOM

```html
<html-fragment href="destination/venice.html">
  <h3>
    <a href="#" onclick="relayEvent(event, 'html-fragment:open')"> Venice </a>
  </h3>
</html-fragment>
```

```js
class HtmlFragmentElement extends HTMLElement {
  connectedCallback() {
    const href = this.getAttribute("href");
    const open = this.hasAttribute("open");

    if (open) loadHTML(href, this);

    this.addEventListener("html-fragment:open", () => loadHTML(href, this));
  }
}
```

---

# Appendix

This stuff is used in the workbook but does not warrant discussion.

```css
/* CSS reset */
* {
  margin: 0;
  box-sizing: border-box;
}
body {
  line-height: 1.5;
}
img {
  max-width: 100%;
}
ul,
menu {
  list-style: none;
  padding: 0;
}

/* page.css */

h1,
h2,
h3,
h5,
h6,
dt,
summary {
  font-family: var(--font-family-display);
  line-height: var(--font-line-height-display);
}
h1 {
  font-size: var(--size-type-xxlarge);
  font-style: oblique;
  line-height: 1;
  font-weight: var(--font-weight-bold);
}
h2 {
  font-size: var(--size-type-xlarge);
  font-weight: var(--font-weight-bold);
}
h3 {
  font-size: var(--size-type-large);
  font-weight: var(--font-weight-normal);
  font-style: oblique;
}
h4 {
  font-size: var(--size-type-mlarge);
  font-weight: var(--font-weight-light);
}
h5 {
  font-size: var(--size-type-body);
  font-weight: var(--font-weight-bold);
}
h6 {
  font-size: var(--size-type-body);
  font-weight: var(--font-weight-normal);
  font-style: italic;
}
dt {
  font-weight: var(--size-type-body);
}
h3,
a[href],
a[onclick] {
  color: var(--color-accent);
}
a[onclick] {
  cursor: pointer;
}
time {
  white-space: nowrap;
}
.card {
  color-background: var(--color-background-card);
}

/* CSS to clean up the demo */
.menu-bar {
  display: flex;
  position: relative;
  gap: 4em;
  background: #f0f0f0;
  padding: 0 0.5em;
}

.menu-bar::after {
  content: "";
  position: absolute;
  height: 4px;
  left: 0;
  right: 0;
  bottom: 0;
  border-bottom: 4px solid #888;
}

.menu-bar > * {
  padding: 0.5em 0;
}
```

```css
/* css tokens */

:root {
  --size-icon-normal: 1em;
  --size-icon-large: 4rem;

  --size-spacing-small: 0.25rem;
  --size-spacing-medium: 0.5rem;
  --size-spacing-large: 1rem;
  --size-spacing-xlarge: 2rem;

  --size-radius-small: var(--size-spacing-small);
  --size-radius-medium: var(--size-spacing-medium);

  --size-type-body: 1rem;
  --size-type-mlarge: 1.25rem;
  --size-type-large: 1.5rem;
  --size-type-xlarge: 2rem;
  --size-type-xxlarge: 2.5rem;

  --color-accent: rgb(42 143 42);
  --color-background-header: var(--color-accent);
  --color-background-page: rgb(238 237 231);
  --color-background-card: white;
  --color-border-control: #999;
  --color-link-inverted: rgb(255 208 0);
  --color-link: var(--color-accent);
  --color-shadow: rgb(3 69 2/50%);
  --color-text: rgb(51 51 51);
  --color-text-heading: var(--color-accent);
  --color-text-inverted: rgb(255 255 255);

  --font-family-body: Merriweather, Baskerville, Cambria, "Noto Serif",
    "Bitstream Charter", serif;
  --font-family-display: Kanit, "Trebuchet MS", Calibri, Roboto, "Segoe UI",
    Ubuntu, sans-serif;

  --font-line-height-body: 1.5;
  --font-line-height-display: 1.125;

  --font-weight-normal: 400;
  --font-weight-light: 200;
  --font-weight-bold: 700;

  --shadow-popover: 1px 1px 2px var(--color-shadow);
}
```
