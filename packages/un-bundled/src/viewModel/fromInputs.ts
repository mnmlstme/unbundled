import { ViewModel, ViewModelPlugin } from "./viewModel.ts";

export function fromInputs<P extends { [key: string]: string }>(
  target: HTMLElement,
  init: P
) {
  return (vm: ViewModel<P>) => new FromInputs<P>(target, init, vm);
}

class FromInputs<T extends object> {
  inputNames: (keyof T)[];

  constructor(target: HTMLElement, init: Partial<T>, vm: ViewModel<T>) {
    this.inputNames = Object.keys(init) as (keyof T)[];
    for (const name in init) vm.set(name, init[name]);

    target.addEventListener("change", (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (input) {
        const name = input.name as keyof T;
        const value = input.value;

        if (this.inputNames.includes(name)) vm.set(name, value);
      }
    });
  }
}
