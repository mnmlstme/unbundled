import { c as Provider, i as FromService, m as __exportAll, o as Service, t as fromAuth, u as Dispatch } from "./auth-DR8MIzV2.js";
import { createViewModel } from "./view.js";
//#region src/store/store.ts
var store_exports = /* @__PURE__ */ __exportAll({
	CONTEXT_DEFAULT: () => STORE_CONTEXT_DEFAULT,
	Provider: () => StoreProvider,
	Service: () => StoreService,
	dispatch: () => dispatch
});
var STORE_CONTEXT_DEFAULT = "context:store";
var StoreService = class StoreService extends Service {
	static {
		this.EVENT_TYPE = "store:message";
	}
	constructor(context, update) {
		super((message, model) => update(model, message), context, StoreService.EVENT_TYPE);
	}
};
var StoreProvider = class extends Provider {
	constructor(updateFn, init) {
		super(init, STORE_CONTEXT_DEFAULT);
		this.viewModel = createViewModel({ authenticated: false }).with(fromAuth(this), "authenticated", "username", "token");
		this._updateFn = updateFn;
	}
	connectedCallback() {
		new StoreService(this.context, (model, message) => this._updateFn(model, message, this.viewModel.toObject())).attach(this);
	}
};
function dispatch(target, message) {
	console.log("📨 Dispatching message:", message, target);
	target.dispatchEvent(new Dispatch(message, StoreService.EVENT_TYPE));
}
//#endregion
//#region src/store/fromStore.ts
function fromStore(target, contextLabel = STORE_CONTEXT_DEFAULT) {
	return new FromService(target, contextLabel);
}
//#endregion
export { store_exports as n, fromStore as t };
