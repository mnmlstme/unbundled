import { TemplateParameter, TemplateParser } from "./template.ts";

const parser = new TemplateParser();

export function html(
  template: TemplateStringsArray,
  ...params: Array<TemplateParameter>
) {
  return parser.parse(template, params);
}
