import { FromService } from "@unbndl/service";
import * as Store from "./store.ts";

export function fromStore<M extends object>(
  target: HTMLElement,
  contextLabel: string = Store.CONTEXT_DEFAULT
) {
  return new FromService<M>(target, contextLabel);
}
