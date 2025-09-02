import { C as Context } from "./context-DxrrEInf.js";
function exposeTuple(scope) {
  return scope.map((cx) => cx.toObject());
}
function createScope(tuple) {
  return tuple.map((a) => new Context(a));
}
export {
  createScope as c,
  exposeTuple as e
};
