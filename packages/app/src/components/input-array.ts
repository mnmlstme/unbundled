import { fromAttributes, ViewModel, View, createViewModel } from "@un-/bundled";

interface InputArrayData {
  name: string;
  values: Array<string>;
}

type InputItem<T> = { name: string; value: T };

export class InputArrayElement extends HTMLElement {
  viewModel: ViewModel<InputArrayData> = createViewModel({
    values: [] as Array<string>
  }).merge({ name: "" }, fromAttributes(this));

  view = this.viewModel.html`
    <fieldset name=${($) => $.name}>
      <slot name="legend><legend>Input Array</legend></slot>
      ${($) =>
        View.map(
          this.itemView,
          $.values.map((s, i) => ({
            name: `${$.name}.${i}`,
            value: s
          }))
        )}
    </fieldset>
  `;

  itemView = View.html<InputItem<string>>`
    <input name=${($) => $.name} value=${($) => $.value}/>
  `;
}
