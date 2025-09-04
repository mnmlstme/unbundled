import { C as Context } from "./context-HO6ROA-_.js";
function exposeTuple(scope) {
  return scope.map(
    (cx) => cx instanceof Context ? cx.toObject() : cx
  );
}
function createScope(tuple) {
  return tuple.map(
    (a) => typeof a === "undefined" ? {} : new Context(a)
  );
}
export {
  createScope as c,
  exposeTuple as e
};
