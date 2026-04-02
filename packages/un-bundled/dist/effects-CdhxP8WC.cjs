//#region src/effects/signal.ts
var SignalEvent = class extends CustomEvent {
	constructor(eventType, signal) {
		super(eventType, {
			bubbles: true,
			cancelable: true,
			composed: true,
			detail: signal
		});
	}
};
//#endregion
//#region src/effects/scheduler.ts
function createEffect(fn, ...scope) {
	const effect = { execute() {
		fn(...scope.map((cx) => cx instanceof Context ? cx.open(effect) : cx));
		scope.forEach((cx) => cx instanceof Context && cx.close());
	} };
	effect.execute();
}
var Scheduler = class Scheduler {
	constructor() {
		this.signals = /* @__PURE__ */ new WeakMap();
		this.scheduled = /* @__PURE__ */ new WeakSet();
	}
	static {
		this.scheduler = new Scheduler();
	}
	subscribe(scope, key, effect) {
		let signals = this.signals.get(scope);
		if (!signals) {
			signals = /* @__PURE__ */ new Map();
			this.signals.set(scope, signals);
		}
		let signal = signals.get(key);
		if (!signal) {
			signal = /* @__PURE__ */ new Set();
			signals.set(key, signal);
		}
		signal.add(effect);
	}
	scheduleEffects(scope, key) {
		const signals = this.signals.get(scope);
		if (!signals) return;
		const signal = signals.get(key);
		if (signal) {
			for (const effect of signal) if (!this.scheduled.has(effect)) {
				this.scheduled.add(effect);
				setTimeout(() => {
					this.scheduled.delete(effect);
					effect.execute();
				});
			}
		}
	}
};
//#endregion
//#region src/effects/manager.ts
var EffectsManager = class {
	constructor() {
		this.running = [];
		this.eventType = "un-effect:change";
	}
	isRunning() {
		return this.running.length > 0;
	}
	push(effect) {
		this.running.push(effect);
	}
	pop() {
		this.running.pop();
	}
	current() {
		const len = this.running.length;
		return len ? this.running[len - 1] : void 0;
	}
	subscribe(key, scope) {
		const current = this.current();
		if (current) Scheduler.scheduler.subscribe(scope, key, current);
	}
	runEffects(key, scope) {
		Scheduler.scheduler.scheduleEffects(scope, key);
		if (this.host) {
			const evt = new SignalEvent(this.eventType, {
				property: key,
				value: scope[key]
			});
			this.host.dispatchEvent(evt);
		}
	}
	setHost(host, eventType) {
		this.host = host;
		if (eventType) this.eventType = eventType;
	}
};
//#endregion
//#region src/effects/context.ts
var Context = class {
	static {
		this.CHANGE_EVENT_TYPE = "un-context:change";
	}
	constructor(init, adoptedContext) {
		if (adoptedContext) {
			this.manager = adoptedContext.manager;
			this.object = adoptedContext.object;
			this.proxy = adoptedContext.proxy;
			this.update(init);
		} else {
			this.manager = new EffectsManager();
			this.object = init;
			this.proxy = createContext(this.object, this.manager);
		}
	}
	get(prop) {
		return this.proxy[prop];
	}
	set(prop, value) {
		this.proxy[prop] = value;
	}
	toObject() {
		return this.object;
	}
	update(next) {
		Object.assign(this.proxy, next);
	}
	apply(mapFn) {
		this.update(mapFn(this.proxy));
	}
	createEffect(fn) {
		createEffect(fn, this);
	}
	setHost(host, eventType) {
		this.manager.setHost(host, eventType);
	}
	open(effect) {
		this.manager.push(effect);
		return this.proxy;
	}
	close() {
		this.manager.pop();
	}
};
function createContext(root, manager) {
	return new Proxy(root, {
		get: (subject, prop, receiver) => {
			const value = Reflect.get(subject, prop, receiver);
			if (manager.isRunning() && isObservable(value)) manager.subscribe(prop, subject);
			return value;
		},
		set: (subject, prop, newValue, receiver) => {
			const didSet = Reflect.set(subject, prop, newValue, receiver);
			if (didSet && isObservable(newValue)) manager.runEffects(prop, subject);
			return didSet;
		}
	});
}
function isObservable(value) {
	switch (typeof value) {
		case "object":
		case "number":
		case "string":
		case "symbol":
		case "boolean":
		case "undefined": return true;
		default: return false;
	}
}
//#endregion
//#region src/effects/effect.ts
var DirectEffect = class {
	constructor(fn, ...scope) {
		this.effectFn = () => fn(...scope);
	}
	execute() {
		this.effectFn();
	}
};
//#endregion
//#region src/effects/scope.ts
function exposeTuple(scope) {
	return scope.map((cx) => cx instanceof Context ? cx.toObject() : cx);
}
function createScope(tuple) {
	return tuple.map((a) => typeof a === "undefined" ? null : new Context(a));
}
//#endregion
Object.defineProperty(exports, "Context", {
	enumerable: true,
	get: function() {
		return Context;
	}
});
Object.defineProperty(exports, "DirectEffect", {
	enumerable: true,
	get: function() {
		return DirectEffect;
	}
});
Object.defineProperty(exports, "EffectsManager", {
	enumerable: true,
	get: function() {
		return EffectsManager;
	}
});
Object.defineProperty(exports, "Scheduler", {
	enumerable: true,
	get: function() {
		return Scheduler;
	}
});
Object.defineProperty(exports, "SignalEvent", {
	enumerable: true,
	get: function() {
		return SignalEvent;
	}
});
Object.defineProperty(exports, "createContext", {
	enumerable: true,
	get: function() {
		return createContext;
	}
});
Object.defineProperty(exports, "createEffect", {
	enumerable: true,
	get: function() {
		return createEffect;
	}
});
Object.defineProperty(exports, "createScope", {
	enumerable: true,
	get: function() {
		return createScope;
	}
});
Object.defineProperty(exports, "exposeTuple", {
	enumerable: true,
	get: function() {
		return exposeTuple;
	}
});
