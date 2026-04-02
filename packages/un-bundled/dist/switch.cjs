Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_switch = require("./switch-BGdAe7dQ.cjs");
Object.defineProperty(exports, "BrowserHistory", {
	enumerable: true,
	get: function() {
		return require_switch.history_exports;
	}
});
Object.defineProperty(exports, "Switch", {
	enumerable: true,
	get: function() {
		return require_switch.switch_exports;
	}
});
exports.fromHistory = require_switch.fromHistory;
