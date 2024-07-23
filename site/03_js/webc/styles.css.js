export default `/* Kram: CSS in Scene 3 */
hello-content img {
  max-width: 8em;
}

/* Kram: CSS in Scene 7 */
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

/* Kram: CSS in Scene 10 */
command-group + command-group {
  --command-group-display-top-hr: none;
}

/* Kram: CSS in Scene 13 */
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

/* Kram: CSS in Scene 13 */
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
`;