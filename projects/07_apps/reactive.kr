---
title: Reactive Programming with Components
model:
  who_am_i: Reactive Programming
  author: The Unbundled Dev
  copyright_year: 2023
  page_views: 9999
---

# Reactive Programming using Web Components

```html
<with-store>
  <p>&copy; Copyright <o-o>copyright_year</o-o> by <o-o>author</o-o>.</p>
  <p>This page has been viewed <o-o>page_views</o-o> times.</p>
</with-store>
```

The basis of reactive programming is that all side-effects are sent to
data store which is provided by the root element of the UI.
To the rest of the code, the store is read-only.

Components may get values from the store, and also listen for change events.

All dynamic web pages require code that retrieves data (for example, from an API)
and inserts it into the HTML or DOM.
Originally, this was accomplished with templating on the server.
But if the data changes, we don't want to reload the entire page, just the data that changed.
Typically, this means using Javascript to fetch the data and then manipulate the DOM.

This is not easy to do. The problem of keeping the DOM in sync with data stored in Javascript
has given rise to multiple competing frameworks; client-side rendering; a proposed extension to JS to add HTML expressions;
and ultimately the idea that Javascript, not HTML, is the lingua franca of the web.

The difficulty here is that HTML provides very few hooks to attach Javascript to elements.
Unless the element was created by JS in the browser, the only way to get a JS handle for an element
is by querying the DOM.
This introduces dependencies between the HTML and Javascript, which makes it difficult to change
either.
HTML custom elements address this difficulty, because they allow us attach Javascript functionality to elements.

Typically, we have a record of data, and a chunk of HTML that presents the data.
What we want is a way, _from HTML_, to say "put this piece of data here".

So let's define two components: one that lets us identify a set of data we want to present,
and one to indicate where to insert each piece.

```html
<template id="with-store-template">
  <slot></slot>
</template>

<template id="o-o-template">
  <slot>no_key</slot>
  <span id="value" class="no-value"></span
  ><!--
	
  --><style>
    slot {
      display: none;
    }

    .no-value {
      background-color: red;
      color: white;
    }

    .no-value::before {
      content: "##NO-VALUE##";
    }</style
  ><!--
--></template>
```

```js
class WithStoreElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("with-store-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    const { get } = connectStore();
    this.getFromStore = get;
    this.dataset.store = JSON.stringify(".");
  }
}

class OOElement extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("o-o-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    this._updateRendering();
  }

  _updateRendering() {
    const valueSpan = this.shadowRoot.getElementById("value");

    const store = this.closest("[data-store]");

    // get field key from slot#key
    const key = this.textContent;

    // lookup key in store
    const value = store.getFromStore(key);

    console.log("Rendering o-o data: ", key, value);

    // set className and innerText on span#value
    switch (typeof value) {
      case "undefined":
        valueSpan.className = "no-value";
        valueSpan.innerText = "";
        break;
      default:
        valueSpan.className = "string-value";
        valueSpan.innerText = value.toString();
    }
  }
}

customElements.define("with-store", WithStoreElement);
customElements.define("o-o", OOElement);
```

---

# Next Scene
