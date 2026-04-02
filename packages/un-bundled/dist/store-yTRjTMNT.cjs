const require_auth = require("./auth-CnY4zES8.cjs");
const require_view = require("./view.cjs");
//#region src/store/store.ts
var store_exports = /* @__PURE__ */ require_auth.__exportAll({
	CONTEXT_DEFAULT: () => STORE_CONTEXT_DEFAULT,
	Provider: () => StoreProvider,
	Service: () => StoreService,
	dispatch: () => dispatch
});
var STORE_CONTEXT_DEFAULT = "context:store";
var StoreService = class StoreService extends require_auth.Service {
	static {
		this.EVENT_TYPE = "store:message";
	}
	constructor(context, update) {
		super((message, model) => update(model, message), context, StoreService.EVENT_TYPE);
	}
};
var StoreProvider = class extends require_auth.Provider {
	constructor(updateFn, init) {
		super(init, STORE_CONTEXT_DEFAULT);
		this.viewModel = require_view.createViewModel({ authenticated: false }).with(require_auth.fromAuth(this), "authenticated", "username", "token");
		this._updateFn = updateFn;
	}
	connectedCallback() {
		new StoreService(this.context, (model, message) => this._updateFn(model, message, this.viewModel.toObject())).attach(this);
	}
};
function dispatch(target, message) {
	console.log("📨 Dispatching message:", message, target);
	target.dispatchEvent(new require_auth.Dispatch(message, StoreService.EVENT_TYPE));
}
//#endregion
//#region src/store/fromStore.ts
function fromStore(target, contextLabel = STORE_CONTEXT_DEFAULT) {
	return new require_auth.FromService(target, contextLabel);
}
//#endregion
Object.defineProperty(exports, "fromStore", {
	enumerable: true,
	get: function() {
		return fromStore;
	}
});
Object.defineProperty(exports, "store_exports", {
	enumerable: true,
	get: function() {
		return store_exports;
	}
});
