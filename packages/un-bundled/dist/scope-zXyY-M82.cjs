"use strict";
const context = require("./context-Dr0y4sel.cjs");
function exposeTuple(scope) {
  return scope.map((cx) => cx.toObject());
}
function createScope(tuple) {
  return tuple.map((a) => new context.Context(a));
}
exports.createScope = createScope;
exports.exposeTuple = exposeTuple;
