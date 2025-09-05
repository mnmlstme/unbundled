import { C as Context } from "./context-6cDFDAR5.js";
function exposeTuple(scope) {
  return scope.map(
    (cx) => cx instanceof Context ? cx.toObject() : cx
  );
}
function createScope(tuple) {
  return tuple.map(
    (a) => typeof a === "undefined" ? null : new Context(a)
  );
}
export {
  createScope as c,
  exposeTuple as e
};
