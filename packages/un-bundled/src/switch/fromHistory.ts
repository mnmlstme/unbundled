import { FromService } from "../service";
import * as History from "./history.ts";

export function fromHistory(
  target: HTMLElement,
  contextLabel: string = History.CONTEXT_DEFAULT
) {
  return new FromService<History.Model>(target, contextLabel);
}
