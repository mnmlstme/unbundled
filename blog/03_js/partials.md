---
title: Loading Partial Content Dynamically
platform: web-standard
---

# Inserting text into the DOM

```html
<p>
  <button
    onclick="addText(
        'Hello, world! ',
        event.target.closest('p'))"
  >
    Say it!
  </button>
</p>
```

```js
function addText(text, container) {
  const node = new Text(text);
  container.append(node);
}

window.addText = addText;
```

---

# Inserting a new element into the DOM

```html
<section>
  <button
    onclick="addParagraph(
        'Hello, world!',
        event.target.closest('section'))"
  >
    Say it!
  </button>
</section>
```

```js
function addParagraph(text, container) {
  const p = document.createElement("p");
  p.textContent = text;
  container.append(p);
}

window.addParagraph = addParagraph;
```

---

# Parsing HTML to insert into the DOM

```html
<section>
  <button
    onclick="addFragment(
        '<h1>Hello, <em>world!</em></h1>How do you do?',
        event.target.closest('section'))"
  >
    Say it with HTML!
  </button>
</section>
```

```js
const parser = new DOMParser();

function addFragment(htmlString, container) {
  const doc = parser.parseFromString(htmlString, "text/html");

  const fragment = Array.from(doc.body.childNodes);

  container.append(...fragment);
}

window.addFragment = addFragment;
```

---

# Fetching content from a server

```html
<pre>
    <code>
        <button onclick="addTextFrom(
            '../FILES/metamorphosis.html',
            event.target.closest('code')
            )"
        > Fetch It! </button>
    </code>
</pre>
```

```js
function addTextFrom(url, container) {
  fetch(url)
    .then((res) => res.text())
    .then((text) => addText(text, container));
}

window.addTextFrom = addTextFrom;
```

---

# Fetching HTML from a server

```html
<article>
  <button
    onclick="addFragmentFrom(
        '../FILES/metamorphosis.html',
        event.target.closest('article')
        )"
  >
    Fetch the HTML!
  </button>
</article>
```

```js
function addFragmentFrom(url, container) {
  fetch(url)
    .then((res) => res.text())
    .then((text) => addFragment(text, container));
}

window.addFragmentFrom = addFragmentFrom;
```
