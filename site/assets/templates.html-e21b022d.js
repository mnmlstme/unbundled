const templates_html = `<html>
          <body>
            <template id="hello-world-template">
  <h1>Hello, <slot>world</slot>!</h1>
</template>

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

<template>
  <slot name="actuator"><button>Menu</button></slot>
  <div id="panel">
    <slot></slot>
  </div>
  <style>
    /* CSS */
  </style>
</template>

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

          </body>
        </html>`;

export { templates_html as default };
