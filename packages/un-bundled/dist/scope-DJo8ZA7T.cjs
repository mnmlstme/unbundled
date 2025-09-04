"use strict";
const context = require("./context-Y-FCGfAL.cjs");
function exposeTuple(scope) {
  return scope.map(
    (cx) => cx instanceof context.Context ? cx.toObject() : cx
  );
}
function createScope(tuple) {
  return tuple.map(
    (a) => typeof a === "undefined" ? {} : new context.Context(a)
  );
}
exports.createScope = createScope;
exports.exposeTuple = exposeTuple;
