import {
  css,
  html,
  shadow,
  fromAttributes,
  ViewModel,
  View,
  createViewModel
} from "@un-/bundled";

interface InputArrayData {
  name: string;
  values: Array<string>;
}

type InputItem<T> = { name: string; value: T };

export class InputArrayElement extends HTMLElement {
  viewModel: ViewModel<InputArrayData> = createViewModel({
    values: [] as Array<string>
  }).merge({ name: "" }, fromAttributes(this));

  static formAssociated = true;
  //formInternals: ElementInternals;
  //private formData;
  inputSlot?: HTMLSlotElement | null;

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
    //this.formInternals = this.attachInternals();
    //this.formData = new FormData();
    shadow(this)
      .styles(InputArrayElement.styles)
      .replace(this.view)
      .delegate("input", {
        change: (ev) => {
          console.log("Changed!", ev);
          const input = ev.target as HTMLInputElement;
          this.changeFormValue(input, input.value);
        }
      });
    this.inputSlot = this.shadowRoot?.querySelector("slot:not([name])");
  }

  view = this.viewModel.html`
    <fieldset name=${($) => $.name}>
      <slot></slot>
      ${($) =>
        $.values.map(
          (s, i) => View.html`
           <input value=${s}/>
           <button>Remove</Button>`
        )}
    </fieldset>
  `;

  itemView = View.html<InputItem<string>>`
    <input value=${($) => $.value}/>
    <button>Remove</Button>
  `;

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
    if (!parent) return undefined;
    const inputs = this.inputSlot?.assignedElements();
    for (let i = 0; inputs && i < inputs.length; i++) {
      console.log("Counting inputs:", i, inputs[i]);
      if (inputs[i] === input) return i;
    }
    return undefined;
  }
}
