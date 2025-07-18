import { FromService } from "../service";
import * as Auth from "./auth.ts";

export function fromAuth(
  target: HTMLElement,
  contextLabel: string = Auth.CONTEXT_DEFAULT
) {
  return new FromService<Auth.Model>(target, contextLabel);
}
