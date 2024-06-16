---
title: Javascript Events
platform: web-standard
---

```html
<dd>
  <a
    onclick="loadHTML(
          'destination/venice.html', 
          event.target.closest('dd'))"
  >
    Venice
  </a>
</dd>
```

---

```html
<dl class="itinerary">
  <dd>
    <a href="destination/venice.html">Venice</a>
  </dd>
  <dd>
    <a href="destination/florence.html">Florence</a>
  </dd>
  <dd>
    <a href="destination/rome.html">Rome</a>
  </dd>
</dl>
```

```js
const links = document.querySelectorAll(".itinerary > dd > a[href]");

for (const link of links) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    loadHTML(event.target.href, event.target.closest("dd"));
  });
}
```

---

## bubbling

```js
const itinerary = document.querySelector(".itinerary");

itinerary.addEventListener("click", (event) => {
  event.preventDefault();
  loadHTML(event.target.href, event.target.closest("dd"));
});
```

---

## dark mode

```html
<body class="page">
  <header>
    <h1>Blazing Travels</h1>
    <label> <input type="checkbox" autocomplete="off" /> Dark mode </label>
  </header>
  …
</body>
```

```js
const page = document.body;

page.addEventListener("change", (event) => {
  const checked = event.target.checked;
  page.classList.toggle("dark-mode", checked);
});
```

---

## stop propagation

```html
<body class="page">
  <header>
    <h1>Blazing Travels</h1>
    <label
      onchange="event.stopPropagation();
        toggleDarkMode(event.target.checked)
      "
    >
      <input type="checkbox" autocomplete="off" /> Dark mode
    </label>
  </header>
</body>
```

---

## custom events

```js
document.body.addEventListener("dark-mode", (event) => {
  const page = event.currentTarget;
  const checked = event.detail.checked;
  page.classList.toggle("dark-mode", checked);
});
```

---

## dispatching events

```js
function toggleDarkMode(target, checked) {
  const customEvent = new CustomEvent("dark-mode:toggle", {
    bubbles: true,
    detail: { checked },
  });

  target.dispatchEvent(customEvent);
}
```

```html
<body class="page">
  <header>
    <h1>Blazing Travels</h1>
    <label
      onchange="event.stopPropagation();
        toggleDarkMode(event.target, event.target.checked)
      "
    >
      <input type="checkbox" autocomplete="off" /> Dark mode
    </label>
  </header>
</body>
```

---

## Relaying events

```html
<label
  onchange="relayEvent(
    event, 
    'dark-mode', 
    {checked: event.target.checked})"
>
  <input type="checkbox" autocomplete="off" /> Dark mode
</label>
```

```js
function relayEvent(event, customType, detail) {
  const relay = event.currentTarget;
  const customEvent = new CustomEvent(customType, {
    bubbles: true,
    detail,
  });

  relay.dispatchEvent(customEvent);
  event.stopPropagation();
}
```
