# Unbundled API documentation

`@unbndl` is a collection of lightweight libraries, 
built on top of Web standards.
The intent is to provide the developer affordances common to
most frameworks, including:

- Core HTML and DOM module
  - [HTML Templating](./html.md)
  - [Event Handling](./events.md)
  - [Web Components and Shadow DOM](./webc.md)
  - [CSS Constructed Stylesheets](./css.md)
- [Views and ViewModels module](./views.md)
- [Authentication and Authorization module](./auth.md)
- [Client-side routing module](./routing.md)
- [Store provider module](./store.md)

As the name implies, the various modules `@unbndl` modules can be
imported individually, without having to load the entire framework.

## Using with JavaScript or TypeScript

`@unbndl` is implemented in TypeScript and
provided as ES modules and type descriptor files.
Use the JavaScript `import` statement to bring
definitions from `@unbndl` into your code.

```ts
import { define, html } from "@unbndl/modules/html";
```

Refer to code examples for each `@unbndl` feature
for an example of the relevant `import` statement.


## Using with Vite

You will need to install `@unbndl/modules` into your project 
for [Vite](vite.dev) to resolve the `import`s from `@unbndl`,

You can use `npm` to install `@unbndl` into your project as follows:

```sh
npm install @unbndl/modules
```

## Using in the browser

You can also use `@unbndl` from `<script>` tags in your HTML. 
Because we use ES modules, the `type="module"` attribute must be specified:

```html
<script type="module" src="myapp.js"></script>

<script type="module">
  import { html } from "@unbndl/modules/html";

  function sayHello() {
    const hello = html`<h1>Hello, world!</h1>`;
    document.body.append(hello);
  }
</script>
```

In order to use `@unbndl` directly in the browser &mdash; 
either in `<script>` tags or in unbundled JavaScript files &mdash; 
you must set up an import map to resolve the `@unbndl/modules` package name.

While you could serve `@unbndl` from your server, it may be more convenient to reference it from a site such as `unpkg.com`:

```html
<script type="importmap">
{
  "imports": {
    "@unbndl/modules":
      "https://unpkg.com/@unbndl/modules"
  }
}
</script>
```
