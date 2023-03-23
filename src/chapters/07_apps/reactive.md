---
title: Reactive Programming with Components
model:
  who_am_i: Reactive Programming
  author: The Unbundled Dev
  copyright_year: 2023
  page_views: 9999
  toolbox:
    available:
      - Rectangle
      - Triangle
      - Circle
      - Polygon
      - Line
      - Path
      - Text
    selected: Rectangle
    current_index: 0
  features:
    fp-moorea:
      feature_name: Moorea
      feature_type: island
      country: French Polynesia
      currency:
        full_name: French Polynesian Franc
        abbrev: FRP
      budget:
        hotel_nightly: 100
        breakfast: 10
        lunch: 20
        dinner: 40
      climate: tropical
      ratings:
        star_1: 0
        star_2: 1
        star_3: 5
        star_4: 30
        star_5: 95
---

# FRP Example

```html
<frp-example-1>
  <frp-view>
    <frp-action on-click="Decrement()"">
      <button>Less cowbell</button>
    </frp-action>
    <p><frp-text>The sound of ${count} cowbells.</frp-text></p>
    <frp-action on-click="Increment()">
      <button>More cowbell</button>
    </frp-action>
  </frp-view>
</frp-example-1>
```

```js
class FrpMain extends HTMLElement {
  constructor(init = {}, update = this.update, msgType = {}) {
    super();
    let content = document.getElementById("frp-main-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
    this.dataset["frpMain"] = name;
    this._model = createObservable(this, init);
    this._messageType = msgType;
    this._update = update;

    console.log("frp-main constructed ", init);
  }

  connectedCallback() {}

  // used by descendants to find their main
  static closest(element) {
    return element.closest("[data-frp-main]");
  }

  // main provides the model (readonly)
  get model() {
    return this._model;
  }

  get messageType() {
    return this._messageType;
  }

  bind(fn) {
    return new Promise((resolve, reject) => {
      try {
        const action = fn(this.dispatch.bind(this), this.messageType);

        resolve(action.bind(null, this.model));
      } catch (error) {
        reject(error);
      }
    });
  }

  dispatch(action) {
    console.log("frp-main: dispatching action", action);
    try {
      this._model = this._update(action, this._model);
    } catch (error) {
      console.log("frp-main: dispatch failed", error, action);
    }
  }

  // default update function; handles assignment messages
  static update(assignments, model) {
    console.log(
      "frp-main: falling back to default update function",
      assignments
    );

    Object.entries(assignments).forEach(([key, value]) => {
      model[key] = value;
    });
    return model;
  }
}
```

```js
class FrpExample1 extends FrpMain {
  constructor() {
    super({ count: 10 }, FrpExample1.update, FrpExample1.MsgType);
  }

  static MsgType = {
    Increment: () => ({ Increment: {} }),
    Decrement: () => ({ Decrement: {} }),
  };

  static update(message, model) {
    const { count } = model;

    switch (Object.keys(message)[0]) {
      case "Increment":
        return super.update({ count: count + 1 }, model);
      case "Decrement":
        return super.update({ count: Math.max(0, count - 1) }, model);
    }
  }
}

customElements.define("frp-example-1", FrpExample1);
```

```html
<template id="frp-main-template">
  <section id="frp-main">
    <slot></slot>
  </section>
</template>
```

---

# Reactive Programming using Web Components

```html
<frp-example-2>
  <frp-view>
    <p>
      <frp-text>&copy; Copyright ${copyright_year} by ${author}.</frp-text>
    </p>
    <p>
      <frp-text>This page has been viewed ${page_views} times.</frp-text>
    </p>
    <p>
      <frp-action on-click="{page_views: page_views+1}">
        <button>Increment View Counter</button>
      </frp-action>
      <frp-action on-change="{author: this.value}">
        <input type="number" />
      </frp-action>
    </p>
  </frp-view>
</frp-example-2>
```

The basis of reactive programming is that all side-effects are sent to
data store which is provided by the root element of the UI.
To the rest of the code, the store is read-only.

> Programming with, or designing upon, asynchronous data streams

> The essence of functional reactive programming is to specify the
> dynamic behavior of a value completely at the time of declaration.

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
Unless the element was created by JS in the browser,
the only way to get a JS handle for an element
is by querying the DOM.
This introduces dependencies between the HTML and Javascript,
making it difficult to change either.
HTML custom elements address this difficulty,
because they allow us attach Javascript functionality to elements.

Typically, we have a record of data, and a chunk of HTML that presents the data.
What we want is a way, _from HTML_, to say "put this piece of data here".

So let's define two components: one that lets us identify a set of data we want to present,
and one to indicate where to insert each piece.

```js
class FrpExample2 extends FrpMain {
  constructor() {
    super(connectStore().root, FrpExample2.update);
  }
}

customElements.define("frp-example-2", FrpExample2);
```

---

```js
class FrpView extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("frp-view-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
    this.dataset["frpView"] = "FrpView";

    console.log("frp-view constructed");
  }

  connectedCallback() {
    this._observing = this.getAttribute("observing");
    this._dispatching = this.getAttribute("dispatching");
    this._main = FrpMain.closest(this);

    if (!this._main) {
      console.warn("frp-view does not have an ancestor frp-main");
    }
  }

  // used by descendants to find their view
  static closest(element) {
    return element.closest("[data-frp-view]");
  }

  get observers() {
    return this._observing || `{${Object.keys(this._main.model).join(",")}}`;
  }

  get messages() {
    return (
      this._dispatching || `{${Object.keys(this._main.messageType).join(",")}}`
    );
  }

  observe(fn, observer) {
    if (observer && observer !== this) {
      this._main.addEventListener("observable:change", (evt) =>
        observer.update(this.observe(fn, this))
      );
    }
    return new Promise((resolve, reject) => {
      try {
        console.log(
          `<<<< ${observer === this ? "reacting" : "observing"} `,
          fn
        );
        const value = fn(this._main.model);
        console.log(">>>> ", value);

        resolve(value);
      } catch (error) {
        reject(error);
      }
    });
  }
}

customElements.define("frp-view", FrpView);
```

```html
<template id="frp-view-template">
  <slot></slot>
</template>
```

```js
class FrpText extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("frp-text-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    const expr = this.textContent.replaceAll(/[`\\]/g, "\\$&");
    const view = FrpView.closest(this);
    const renderFn = Function(
      "model",
      `const ${view.observers} = model;
       return \`${expr}\`;
      `
    ).bind(this);

    console.log("frp-text: ", view.observers, expr);

    this.update(view.observe(renderFn, this));
  }

  update(promise) {
    const span = this.shadowRoot.getElementById("value");

    promise
      .then((value) => {
        span.innerText = value;
        span.className = `${typeof value}-value`;
      })
      .catch((error) => {
        span.innerText = error.toString();
        span.className = "error-value";
      });
  }
}

customElements.define("frp-text", FrpText);
```

```html
<template id="frp-text-template">
  <span id="value" class="undefined-value"></span>
  <slot>Use template literal syntax here.</slot
  ><style>
    .string-value + slot {
      display: none;
    }

    .error-value,
    .error-value + ::slotted(*) {
      background: red;
      color: white;
    }
  </style></template
>
```

## FRP Actions

```js
class FrpAction extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("frp-action-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    const expr = this.getAttribute("on-click");
    const main = FrpMain.closest(this);
    const view = FrpView.closest(this);
    const actionFn = Function(
      "dispatch",
      "msgTypes",
      `const ${view.messages} = msgTypes;
       return (${view.observers}, event) => dispatch(${expr});`
    ).bind(this);

    this.update(main.bind(actionFn));
  }

  update(promise) {
    const target = this.shadowRoot.firstElementChild;

    promise
      .then((handler) => {
        target.onclick = handler;
        console.log("frp-action: Bound on-click handler", target);
      })
      .catch((error) => {
        target.onclick = null;
        console.warn(
          "frp-action: Unable to bind on-click handler",
          error,
          target
        );
      });
  }
}

customElements.define("frp-action", FrpAction);
```

```html
<template id="frp-action-template">
  <slot></slot>
</template>
```

---

## Using Proxies to implement Observable

```js
function createObservable(eventTarget, root) {
  const OBSERVABLE_CHANGE_EVENT = "observable:change";

  console.log("creating Observable:", JSON.stringify(root));

  let proxy = new Proxy(root, {
    get: (target, prop, receiver) => {
      const value = Reflect.get(target, prop, receiver);
      console.log(`Observable['${prop}'] => ${JSON.stringify(value)}`);
      return value;
    },
    set: (target, prop, newValue, receiver) => {
      const oldValue = root[prop];
      console.log(
        `Observable['${prop}'] <= ${JSON.stringify(
          newValue
        )}; was ${JSON.stringify(oldValue)}`
      );
      const didSet = Reflect.set(target, prop, newValue, receiver);
      if (didSet) {
        let evt = new CustomEvent(OBSERVABLE_CHANGE_EVENT, {
          bubbles: true,
          cancelable: true,
        });
        eventTarget.dispatchEvent(
          Object.assign(evt, {
            property: prop,
            oldValue,
            value: newValue,
          })
        );
      }
      return didSet;
    },
  });

  return proxy;
}
```
