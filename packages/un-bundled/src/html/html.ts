import {
  Template,
  TemplateArgs,
  TemplateParameter,
  TemplateEffect
} from "./template";
import { TemplateParser } from "./parser";
import {
  AttributeValueMutation,
  AttributeValueEffect,
  AttributeValuePlace,
  ElementContentMutation,
  ElementContentEffect,
  ElementContentPlace,
  TagContentPlace,
  TagReferenceEffect
} from "./mutation";

const htmlParser = new TemplateParser<TemplateArgs>();

htmlParser.use([
  {
    place: "element content",
    types: ["string", "number", "bigint", "symbol", "boolean"],
    mutator: (
      place: ElementContentPlace,
      value: TemplateParameter<TemplateArgs>
    ) =>
      new ElementContentMutation(
        place,
        new Text(value?.toString() || "")
      )
  },
  {
    place: "attr value",
    types: ["string", "number", "bigint", "symbol"],
    mutator: (
      place: AttributeValuePlace,
      value: TemplateParameter<TemplateArgs>
    ) =>
      new AttributeValueMutation(
        place as AttributeValuePlace,
        value?.toString() || ""
      )
  },
  {
    place: "element content",
    types: (param: TemplateParameter<TemplateArgs>) =>
      param instanceof Node,
    mutator: (
      place: ElementContentPlace,
      value: TemplateParameter<TemplateArgs>
    ) => new ElementContentMutation(place, value as Node)
  },
  {
    place: "element content",
    types: ["function"],
    mutator: (
      place: ElementContentPlace,
      param: TemplateEffect<TemplateArgs>
    ) => new ElementContentEffect(place, param)
  },
  {
    place: "attr value",
    types: ["function"],
    mutator: (
      place: AttributeValuePlace,
      param: TemplateEffect<TemplateArgs>
    ) => new AttributeValueEffect(place, param)
  },
  {
    place: "tag content",
    types: ["function"],
    mutator: (
      place: TagContentPlace,
      param: TemplateEffect<TemplateArgs>
    ) => new TagReferenceEffect(place, param)
  }
]);

export function html<TT extends TemplateArgs>(
  template: TemplateStringsArray,
  ...params: Array<TemplateParameter<TT>>
): Template<TT> {
  return (htmlParser as TemplateParser<TT>).parse(
    template,
    params
  );
}
