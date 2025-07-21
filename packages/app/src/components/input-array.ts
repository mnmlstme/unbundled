import {
  css,
  shadow,
  fromAttributes,
  ViewModel,
  View,
  createView,
  createViewModel
} from "@un-/bundled";

const html = View.html;

interface InputArrayData {
  name: string;
  values: Array<string>;
}

export class InputArrayElement extends HTMLElement {
  viewModel: ViewModel<InputArrayData> = createViewModel({
    values: [] as Array<string>
  }).merge({ name: "" }, fromAttributes(this));

  static formAssociated = true;

  get name(): string {
    return this.viewModel.$.name;
  }

  get value(): Array<string> {
    return this.viewModel.$.values;
  }

  set value(array: Array<string>) {
    this.viewModel.set("values", array);
  }

  constructor() {
    super();
    shadow(this)
      .styles(InputArrayElement.styles)
      .replace(this.viewModel.render(this.view))
      .delegate("input", {
        change: (ev: Event) => {
          console.log("Changed!", ev);
          const input = ev.target as HTMLInputElement;
          this.changeFormValue(input, input.value);
        }
      });
  }

  view = createView<InputArrayData>(html`
    <fieldset name=${($) => $.name}>
      <slot></slot>
      <ul>
        ${($) =>
          $.values.map(
            (s, i) => View.html`
              <li>
           <input name=${i} value=${s}/>
           <button>Remove</Button>
              </li>`
          )}
      </ul>
    </fieldset>
  `);

  itemView = createView<{ value: string }>(html`
    <input value=${($) => $.value} />
    <button>Remove</button>
  `);

  static styles = css`
    fieldset {
      padding: 0;
      border: none;
    }
  `;

  changeFormValue(input: HTMLElement, value: string) {
    const index = this.getElementIndex(input);
    if (index) this.viewModel.$.values[index] = value;
  }

  getElementIndex(input: HTMLElement): number | undefined {
    const item = input.closest("li");
    const list = item?.closest("ul");
    if (!list) return undefined;
    console.log("Getting Index of input:", input);
    const items = list.children;
    for (let i = 0; items && i < items.length; i++) {
      if (items[i] === item) return i;
    }
    return undefined;
  }
}
