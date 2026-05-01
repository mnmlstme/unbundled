# Writing HTML templates in JavaScript

We often need to embed fragments of HTML in JavaScript.
Using `html`-tagged template literals has several benefits:

- Variable parts of the template can be interpolated using `${...}` syntax.
- The resultant string is automatically parsed into a `DocumentFragment`
- Interpolated strings are automatically escaped, avoiding a frequent cause of errors and unsafe practices
- The `html` tag is recognized by most code editors, allowing for appropriate
  syntax highlighting and formatting

## `html`

```ts
function html(
  template: TemplateStringsArray,
  ...values: string[]
) : Template<Args> // extends DocumentFragment
```

The `html`` function is defined such that it can be
used as a template literal tag. In general, a template literal can contain substitution parameters, by using the `${...}` syntax.

The `template` parameter is an array of all the strings in the template &mdash; before, between, and after the substitution parameters. It will always contain at least one string.

The `values` are the results of evaluating the
expressions in the substitution parameters.
These values are inserted in the resulting DOM in a manner which depends on their type:

`string`
: as `Text` nodes

`number`, `boolean`
: as `Text` nodes, after conversion to strings

`Array`
: as `DocumentFragment`s containing the
converted values of the array elements

`Node` (DOM)
: inserted directly without conversion. Most common usage is where the node is a `DocumentFragment` resulting from a nested `html`-tagged template literal expression.

`function`
: When `html` is used to create views, functions within the template will
be evaluated and the resulting value interpolated into the template. See
[Views and Viewmodels](./views.md) for more information.

Any other `object`, `symbol`, `bigint`:
: as `Text` nodes, after conversion to strings

### Usage

`html`-tagged template literals are typically
used for client-side rendering: generating DOM
that depends on data at run-time.

```ts
import { html } from "@unbndl/html";

const name = "CSC 437";
const today = new Date();
const colors = ["red", "blue", "green"];

const fragment = html`
  <h1>Hello, ${name}</h1>
  <p>Today is ${today}</p>
  <label>
    Select your favorite color:
    <select name="color">
      ${colors.map(
        (c) => html`<option value="$c">$c</option>`
      )}
    </select>
  <label>
`;
```
### Under the hood

Unbundle's implementation of `html` is based on
the `DOMParser()` web API. A simplified version,
which only handles static string interpolation,
can be written like this:

```js
const parser = new DOMParser();

export function html(template,  ...params) {
  const htmlString = template
    .map((s, i) => (i ? [params[i - 1], s] : [s]))
    .flat()
    .join("");
  const doc = parser.parseFromString(htmlString, "text/html");
  const collection = doc.head.childElementCount
    ? doc.head.childNodes
    : doc.body.childNodes;
  const fragment = new DocumentFragment();

  fragment.replaceChildren(...collection);

  return fragment;
}
````
