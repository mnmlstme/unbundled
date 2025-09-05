"use strict";
const context = require("./context-sArnt9mX.cjs");
function exposeTuple(scope) {
  return scope.map(
    (cx) => cx instanceof context.Context ? cx.toObject() : cx
  );
}
function createScope(tuple) {
  return tuple.map(
    (a) => typeof a === "undefined" ? null : new context.Context(a)
  );
}
exports.createScope = createScope;
exports.exposeTuple = exposeTuple;
