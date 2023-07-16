---
title: Itinerary Custom Element
---

# Itinerary with Custom Element Markup

```html
<blz-itinerary>
  <blz-destination>
    <span slot="nights">4</span>
    <span slot="name">Venice</span>
    <span slot="dates">14 Oct - 18 Oct</span>
    <blz-accommodation>
      <a href="#">Locanda San Barnaba</a>
    </blz-accommodation>
    <blz-excursion>
      <a href="#">Murano</a>
    </blz-excursion>
    <blz-excursion type="walking-tour">
      <a href="#">Piazza San Marco</a>
    </blz-excursion>
  </blz-destination>
</blz-itinerary>
```

Here's how you might mark up the first destination of the itinerary
with much greater precision than you were able to do in HTML
I've created some new tag names so I can later define very semantics.
And because those semantics are specific to our application, Blazing Travels, I've put
a prefix of `blz-` on each of the tag names.
This way, there is no ambiguity, either with standard HTML tags—which are guaranteed to
never include a hyphen—or the information architecture of some other project.

Try loading this markup into a browser, and you will just see the place names.
If you inspect the page in Developer Tools, though, you will see the element hierarchy.
For any element with an unrecognized tag name, the browser just displays its contents.
Since the `<blz-place>` elements contain text—which the browser is able to present—that text
is displayed.

If you want to do anything else—you need to _register_ the tag name as a custom element.
And that must be done using Javascript.

So you have to learn Javascript. Yeah, not only that, you need to learn Javascript classes,
which are nothing like the `class` attribute in HTML.
But the good part of this, is that much of the code that defines each of these custom
elements can be written in HTML/CSS.
You will actually end up re-using a lot of the HTML and CSS that you wrote previously.

```html
<template id="blz-accommodation-template">
  <p>Stay at <slot>*** Accommodation Name Goes HERE ***</slot></p>
  <style>
    * {
      margin: 0;
    }
  </style>
</template>
```

HTML `<template>` elements can be put almost anywhere, but putting them in the `<head>` keeps
them separate from content.

The `<slot>` element is a placeholder. The contents of the `<blz-place>` element will be
inserted there. The text "Some Place Name" will only appear if `<blz-place>` is empty.

Now for the Javascript code to register the `blz-place` element and connect it to
the `<template>`.
All Javascript goes in a `<script>` element.
For now, we'll keep all `<script>` element in the `<head>`.
First, you need to define a `class`.

```js
class BlzAccommodation extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("blz-accommodation-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("blz-accommodation", BlzAccommodation);
```

The class must extend the standard Javascript class `HTMLElement`, which means it
has all the capabilities of any other HTML element.

By registering the tag name `blz-place` and linking it to class `BlzPlace`,
you are going to tell the browser to use class `BlzPlace` instead of `HTMLElement`
to construct a new element node in the _DOM_—the Document Object Model.
For now, this line can go in the same `<script>` tag as the class definition above.

---

## Assembling Parts of the Destination

```html
<blz-destination>
  <span slot="nights">4</span>
  <span slot="name">Venice</span>
  <span slot="dates">14 Oct - 18 Oct</span>
  <blz-accommodation><a href="#">Locanda San Barnaba</a></blz-accommodation>
  <blz-excursion><a href="#">Murano</a></blz-excursion>
  <blz-excursion type="walking-tour"
    ><a href="#">Piazza San Marco</a></blz-excursion
  >
</blz-destination>
```

This `blz-destination` contains four elements, the first of which has a `slot="name"`
attribute.
This is a _named slot_, and there is a matching `<slot name="name">` in the template.
There is another named slot, `nights`.
Note that the template has switched the order in which these values are displayed.

```html
<template id="blz-destination-template">
  <p><slot name="dates">*** Date Range ***</slot></p>
  <header>
    <h2><slot name="name">*** Name of Destination ***</slot></h2>
    <p><slot name="nights">##</slot> nights</p>
  </header>
  <div class="list">
    <slot>*** Accommodations and Excursions Go HERE ***</slot>
  </div>
  <style>
    * {
      margin: 0;
    }
    :host {
      display: grid;
      grid-template-columns: min-content auto 1fr;
      gap: var(--size-spacing-medium) var(--size-spacing-large);
    }
    header {
      --color-text: var(--color-text-inverted);
      --color-text-heading: var(--color-text-inverted);
      --color-link: var(--color-link-inverted);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: var(--size-spacing-small);
      background: var(--color-background-header);
      color: var(--color-text);
    }
    h2 {
      color: var(--color-text-heading);
      font-family: var(--font-display);
    }
    .list {
      display: flex;
      flex-direction: column;
    }
  </style>
</template>
```

We need to bring in the reset and some of `page.css` because CSS declarations
are not inherited from the light DOM to the shadow DOM.

When you created the `<blz-destination>` element, you supplied an attribute,
`nights="4"`.
This attribute is not part of the HTML standard—it is a _custom_ attribute.
You will need to write some code in the `BlzDestination` class to copy that value
into the `<p>` element provided for it.
This is similar to using a slot.

```js
class BlzDestination extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("blz-destination-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("blz-destination", BlzDestination);
```

---

## Specific Semantics with Custom Attributes

```html
<blz-destination>
  <span slot="nights">4</span>
  <span slot="name">Venice</span>
  <span slot="dates">14 Oct - 18 Oct</span>
  <blz-accommodation><a href="#">Locanda San Barnaba</a></blz-accommodation>
  <blz-excursion><a href="#">Murano</a></blz-excursion>
  <blz-excursion type="walking-tour"
    ><a href="#">Piazza San Marco</a></blz-excursion
  >
</blz-destination>
```

There are different types of excursions that we want to represent differently.
In the prototype, the text "Walking tour of" was part of the content.
But you would like all walking tours to use the same text,
or perhaps, eventually, an icon.
This text could also be translated into a persons' preferred language.
In short, this text should not be part of the data, but the interface.

One way to remove this text from the data of the app and make part of the interface,
is categorize excursions by type and specify the type through a custom attribute.

The template for an excursion is much like that for accommodation.
The difference is that the `<p>` has an `id`, which will allow us to access it easily from
Javascript.

```html
<template id="blz-excursion-template">
  <p id="message">
    Visit <slot id="place">*** Place Visited Goes HERE ***</slot>
  </p>
  <style>
    * {
      margin: 0;
    }
  </style>
</template>
```

There's no feature in HTML templates for accessing attributes, like `<slot>` provides for contents.
This must be done by Javascript code in the custom element's class.

```js
class BlzExcursion extends HTMLElement {
  constructor() {
    super();
    const content = document.getElementById("blz-excursion-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }

  connectedCallback() {
    const type = this.getAttribute("type");

    console.log("Excursion:", type, this);

    if (type) {
      this._updateMessage(type);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "type") {
      this._updateMessage(newValue);
    }
  }

  _updateMessage(type) {
    let message = this.shadowRoot.getElementById("message");
    let place = this.shadowRoot.getElementById("place");

    switch (type) {
      case "walking-tour":
        message.replaceChildren("Walking tour of ", place);
        break;
      default:
        message.replaceChildren("Visit ", place);
        break;
    }
  }
}

customElements.define("blz-excursion", BlzExcursion);
```

---

## Container Controls Layout

```html
  <blz-itinerary>
    <blz-destination>
      <span slot="nights">4</span>
      <span slot="name">Venice</span>
      <span slot="dates">14 Oct - 18 Oct</span>
      <blz-accommodation><a href="#">Locanda San Barnaba</a></blz-accommodation>
      <blz-excursion><a href="#">Murano</a></blz-excursion>
      <blz-excursion type="walking-tour"><a href="#">Piazza San Marco</a></blz-excursion>
    </blz-destination>
  </blz-itinerary></template>
```

```html
<template id="blz-itinerary-template">
  <div class="itinerary">
    <slot>*** Destinations and Transportation Go HERE ***</slot>
  </div>
  <style>
    .itinerary {
      display: grid;
      grid-template-columns:
        [start] auto [header] auto
        [info] 1fr 2fr 1fr 2fr [end];
      gap: var(--size-spacing-medium) var(--size-spacing-large);
      align-items: baseline;
      margin: var(--size-spacing-small);
    }

    ::slotted(*) {
      display: subgrid;
    }
  </style>
</template>
```

```js
class BlzItinerary extends HTMLElement {
  constructor() {
    super();
    let content = document.getElementById("blz-itinerary-template").content;
    this.attachShadow({ mode: "open" }).appendChild(content.cloneNode(true));
  }
}

customElements.define("blz-itinerary", BlzItinerary);
```

---

## Design Tokens

```css
:root {
  /* Design Tokens */
  --color-accent: rgb(42 143 42);
  --color-background-header: var(--color-accent);
  --color-background-page: rgb(237 233 217);
  --color-background-section: rgb(248 250 2248);
  --color-border-section: var(--color-accent);
  --color-link-inverted: rgb(255 208 0);
  --color-link: var(--color-accent);
  --color-text: rgb(51 51 51);
  --color-text-heading: var(--color-accent);
  --color-text-inverted: rgb(255 255 255);

  --font-body: Merriweather, Baskerville, Cambria, "Noto Serif",
    "Bitstream Charter", serif;
  --font-display: Kanit, "Trebuchet MS", Calibri, Roboto, "Segoe UI", Ubuntu,
    sans-serif;

  --lineweight-border-thin: 1px;
  --lineweight-rule: 1px;

  --size-font-body: 0.875rem;
  --size-font-title: 2.5rem;
  --size-radius-medium: 0.5rem;
  --size-spacing-small: 0.25rem;
  --size-spacing-medium: 0.5rem;
  --size-spacing-large: 1rem;

  --style-font-title: italic;

  --weight-font-body: 400;
  --weight-font-title: 700;
  --weight-font-title-muted: 200;
}
```

## Page CSS

```css
* {
  margin: 0;
}
body {
  background: var(--color-background-page);
  color: var(--color-text);
  font: var(--size-font-body) var(--font-body);
}
a {
  color: var(--color-link);
}
```
