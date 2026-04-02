import { a as createContext, i as Context, t as createScope } from "./effects-Qxlhpdz3.js";
//#region src/view/source.ts
var MappedSource = class {
	constructor(source, mapping) {
		this.origin = source;
		const entries = mapEntries(mapping).map(([t, s]) => [s, t]);
		this.inverse = Object.fromEntries(entries);
	}
	mapObservation(source) {
		const entries = Object.entries(source);
		return Object.fromEntries(entries.map(([s, v]) => {
			return [this.inverse[s], v];
		}).filter((pair) => pair.length > 0));
	}
	start(fn) {
		const sfn = (s, value) => {
			const t = this.inverse[s];
			fn(t, value);
		};
		return this.origin.start(sfn).then((obs) => this.mapObservation(obs));
	}
};
function mapEntries(mapping) {
	return Object.entries(mapping).map(([k, v]) => [k, v]);
}
//#endregion
//#region src/view/view.ts
function createView(html) {
	return html;
}
function createView2(html) {
	return html;
}
function createViewN(html) {
	return html;
}
function zipArgs(...lists) {
	const maxLength = lists.map((arr) => arr.length).reduce((a, b) => Math.max(a, b), 0);
	return Array.from(Array(maxLength).keys()).map((i) => lists.map((arr) => arr[i]));
}
function map(view, list) {
	return mapN(view, list);
}
function map2(view, ulist, vlist) {
	return mapN(view, ulist, vlist);
}
function mapN(view, ...lists) {
	if (!lists.length) return "";
	return zipArgs(...lists).map((tuple) => applyN(view, ...tuple)).flat();
}
function apply(view, t) {
	return typeof t === "undefined" ? "" : applyN(view, t);
}
function apply2(view, u, v) {
	return typeof u === "undefined" || typeof v === "undefined" ? "" : applyN(view, u, v);
}
function applyN(view, ...tuple) {
	if (!tuple) return "";
	const scope = createScope(tuple);
	return view.render(...scope);
}
var View = {
	apply,
	apply2,
	applyN,
	map,
	map2,
	mapN
};
//#endregion
//#region src/view/viewModel.ts
var ViewModel = class extends Context {
	constructor(init, adoptedContext) {
		super(init, adoptedContext);
	}
	get $() {
		return this.toObject();
	}
	with(source, ...keys) {
		const mapping = Object.fromEntries(keys.map((k) => [k, k]));
		return this.merge(new MappedSource(source, mapping));
	}
	withCalculated(source, mapping) {
		return this.merge(new MappedSource(source, mapping));
	}
	withRenamed(source, renaming) {
		return this.merge(new MappedSource(source, renaming));
	}
	merge(source) {
		if (source) {
			const entries = source.start((name, value) => {
				console.log("🪄 Merging effect", name, value, entries);
				this.set(name, value);
			}).then((firstObservation) => {
				console.log("👀 ViewModel source observed:", firstObservation, entries);
				Object.keys(firstObservation).forEach((k) => this.set(k, firstObservation[k]));
			});
		}
		return this;
	}
	render(template) {
		return template.render(this);
	}
};
function createViewModel(init) {
	if (init === void 0) return new ViewModel({});
	else return new ViewModel(init);
}
//#endregion
//#region src/view/fromAttributes.ts
function fromAttributes(subject) {
	return new FromAttributes(subject);
}
var FromAttributes = class {
	constructor(subject) {
		this.subject = subject;
	}
	start(fn) {
		const observer = new MutationObserver(effectChanges);
		const element = this.subject;
		observer.observe(element, { attributes: true });
		return new Promise((resolve, _reject) => {
			const init = {};
			const attributes = element.attributes;
			for (const attr of attributes) init[attr.name] = attr.value;
			resolve(init);
		});
		function effectChanges(mutations) {
			mutations.forEach((mut) => {
				const name = mut.attributeName;
				fn(name, element.getAttribute(name));
			});
		}
	}
};
//#endregion
//#region src/view/fromInputs.ts
function fromInputs(subject) {
	return new FromInputs(subject);
}
var FromInputs = class {
	constructor(subject) {
		this.subject = subject;
	}
	start(fn) {
		this.subject.addEventListener("change", (event) => {
			const input = event.target;
			if (input) {
				const name = input.name;
				const value = input.value;
				fn(name, value);
			}
		});
		return new Promise((_resolve, _reject) => {});
	}
};
//#endregion
export { Context, MappedSource, View, ViewModel, createContext, createView, createView2, createViewModel, createViewN, fromAttributes, fromInputs };
