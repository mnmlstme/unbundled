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
    <frp-action on-click="Msg.Decrement">
      <button>Less cowbell</button>
    </frp-action>
    <p><frp-text>The sound of ${model.count} cowbells.</frp-text></p>
    <frp-action on-click="Msg.Increment">
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
    this._model = createObservable(this, init);
    this._messageType = msgType;
    this._update = update;
    this.dataset["frpMain"] = name;

    console.log("frp-main constructed ", this._model);
  }

  connectedCallback() {}

  // used by descendants to find their main
  static closest(element) {
    return element.closest("[data-frp-main]");
  }

  static whenObservableFrom(element) {
    const available = element.closest("[data-frp-main]");

    if (available) {
      return Promise.resolve({
        model: available.model,
        attach: available.attachObserver.bind(available),
      });
    }

    return new Promise((resolve, reject) => {
      // search for the closest undefined parent
      let candidate = element.closest(":not(:defined)");

      if (candidate) {
        // wait for the blocking element to be defined,
        // and then upgrade it when it is.
        customElements.whenDefined(candidate.localName).then(() => {
          if (candidate instanceof FrpMain) {
            resolve({
              model: candidate.model,
              attach: candidate.attachObserver.bind(candidate),
            });
          } else {
            // should continue up the tree, but for now, reject.
            reject({
              error: `Found ${candidate.localName}, but it is not FrpMain`,
              candidate,
            });
          }
        });
      } else {
        throw "No candidates found for frp-main element";
      }
    });
  }

  attachObserver(update) {
    console.log("Setting up event listener for observer.update", this);
    this.addEventListener("observable:change", () => update(this.model));
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

        console.log("frp-main: binding action to model:", action, this._model);
        resolve(action.bind(null, this._model));
      } catch (error) {
        reject(error);
      }
    });
  }

  dispatch(action) {
    console.log("frp-main: dispatching action", action);
    try {
      this._update(action, this.model);
    } catch (error) {
      console.log("frp-main: dispatch failed", error, action);
    }
  }

  // default update function; handles assignment messages
  static update(assignments, model) {
    console.log("frp-main: update", assignments);

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
        return (model.count = count + 1);
      case "Decrement":
        return (model.count = Math.max(0, count - 1));
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

## View watches for changes to values it needs

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
    this.observable = FrpMain.whenObservableFrom(this);
  }

  // used by descendants to find their view
  static closest(element) {
    return element.closest("[data-frp-view]");
  }

  get observers() {
    return this._observing || "model";
  }

  get messages() {
    return this._dispatching || "Msg";
  }

  observe(fn, observer) {
    const update = (model) => {
      Promise.resolve(fn(model))
        .then((value) => observer.update(value))
        .catch((error) => observer.report(error));
    };

    this.observable.then(({ model, attach }) => {
      attach(update);
      update(model);
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

---

## Exposing parts of a model to a view

```html
<frp-example-2>
  <frp-view observing="{copyright_year, author, page_views}">
    <p>
      <frp-text>&copy; Copyright ${copyright_year} by ${author}.</frp-text>
    </p>
    <p>
      <frp-text>This page has been viewed ${page_views} times.</frp-text>
    </p>
    <p>
      <frp-action on-click="() => ({page_views: page_views+1})">
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
      "__model__",
      `const ${view.observers} = __model__;
       return \`${expr}\`;
      `
    ).bind(this);

    console.log("frp-text: ", view.observers, expr);

    view
      .observe(renderFn, this)
      .then((value) => this.update(value))
      .catch((error) => this.report(error));
  }

  update(value) {
    const span = this.shadowRoot.getElementById("value");

    span.innerText = value;
    span.className = `${typeof value}-value`;
  }

  report(error) {
    const span = this.shadowRoot.getElementById("value");

    span.innerText = error.toString();
    span.className = "error-value";
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

---

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
      "__dispatch__",
      "__Msg__",
      `const ${view.messages} = __Msg__;
      return function (${view.observers}, __event__) {
        const __handler__ = ${expr};
        __dispatch__(__handler__(__event__));
      }`
    ).bind(this);

    main
      .bind(actionFn)
      .then((handler) => this.update(handler))
      .catch((error) => this.report(error));
  }

  update(handler) {
    const target = this.shadowRoot.firstElementChild;

    target.onclick = handler;
    console.log("frp-action: Bound on-click handler", target);
  }

  report(error) {
    const target = this.shadowRoot.firstElementChild;

    target.onclick = null;
    console.warn("frp-action: Unable to bind on-click handler", error, target);
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
      if (prop === "then") {
        return undefined;
      }
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
        Object.assign(evt, { property: prop, oldValue, value: newValue });
        eventTarget.dispatchEvent(evt);
        console.log("dispatched event to target", evt, eventTarget);
      } else {
        console.log(`Observable['${prop}] was not set to ${newValue}`);
      }
      return didSet;
    },
  });

  return proxy;
}
```
