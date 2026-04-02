const require_auth = require("./auth-CnY4zES8.cjs");
const require_html = require("./html-5oZrUNCN.cjs");
const require_view = require("./view.cjs");
//#region src/switch/history.ts
var history_exports = /* @__PURE__ */ require_auth.__exportAll({
	CONTEXT_DEFAULT: () => HISTORY_CONTEXT_DEFAULT,
	Provider: () => HistoryProvider,
	Service: () => HistoryService,
	dispatch: () => dispatch
});
var HISTORY_CONTEXT_DEFAULT = "context:history";
var HistoryService = class HistoryService extends require_auth.Service {
	static {
		this.EVENT_TYPE = "history:message";
	}
	constructor(context) {
		super((msg, apply) => this.update(msg, apply), context, HistoryService.EVENT_TYPE);
	}
	update(message, model) {
		switch (message[0]) {
			case "history/navigate": {
				const { href, state } = message[1];
				history.pushState(state, "", href);
				return {
					...model,
					location: document.location,
					state: history.state
				};
			}
			case "history/redirect": {
				const { href, state } = message[1];
				history.replaceState(state, "", href);
				return {
					...model,
					location: document.location,
					state: history.state
				};
			}
		}
	}
};
var HistoryProvider = class extends require_auth.Provider {
	constructor() {
		super({
			location: document.location,
			state: {}
		}, HISTORY_CONTEXT_DEFAULT);
		this.addEventListener("click", (event) => {
			const linkTarget = originalLinkTarget(event);
			if (linkTarget) {
				const url = new URL(linkTarget.href);
				const location = this.context.get("location");
				if (location && url.origin === location.origin && url.pathname.startsWith(this.base || "/")) {
					event.preventDefault();
					dispatch(linkTarget, "history/navigate", { href: url.pathname + url.search });
				}
			}
		});
		window.addEventListener("popstate", (event) => {
			this.context.update({
				location: document.location,
				state: event.state
			});
		});
	}
	get base() {
		return this.getAttribute("base") || void 0;
	}
	connectedCallback() {
		new HistoryService(this.context).attach(this);
	}
	attributeChangedCallback() {}
};
function originalLinkTarget(event) {
	const current = event.currentTarget;
	const isLink = (el) => el.tagName == "A" && el.href;
	if (event.button !== 0) return void 0;
	if (event.composed) {
		const target = event.composedPath().find(isLink);
		return target ? target : void 0;
	} else {
		for (let target = event.target; target; target === current || target.parentElement) if (isLink(target)) return target;
		return;
	}
}
var dispatch = require_auth.dispatcher(HistoryService.EVENT_TYPE);
//#endregion
//#region ../../node_modules/route-parser/lib/route/compiled-grammar.js
var require_compiled_grammar = /* @__PURE__ */ require_auth.__commonJSMin(((exports) => {
	var parser = (function() {
		var o = function(k, v, o, l) {
			for (o = o || {}, l = k.length; l--; o[k[l]] = v);
			return o;
		}, $V0 = [1, 9], $V1 = [1, 10], $V2 = [1, 11], $V3 = [1, 12], $V4 = [
			5,
			11,
			12,
			13,
			14,
			15
		];
		var parser = {
			trace: function trace() {},
			yy: {},
			symbols_: {
				"error": 2,
				"root": 3,
				"expressions": 4,
				"EOF": 5,
				"expression": 6,
				"optional": 7,
				"literal": 8,
				"splat": 9,
				"param": 10,
				"(": 11,
				")": 12,
				"LITERAL": 13,
				"SPLAT": 14,
				"PARAM": 15,
				"$accept": 0,
				"$end": 1
			},
			terminals_: {
				2: "error",
				5: "EOF",
				11: "(",
				12: ")",
				13: "LITERAL",
				14: "SPLAT",
				15: "PARAM"
			},
			productions_: [
				0,
				[3, 2],
				[3, 1],
				[4, 2],
				[4, 1],
				[6, 1],
				[6, 1],
				[6, 1],
				[6, 1],
				[7, 3],
				[8, 1],
				[9, 1],
				[10, 1]
			],
			performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
				var $0 = $$.length - 1;
				switch (yystate) {
					case 1: return new yy.Root({}, [$$[$0 - 1]]);
					case 2: return new yy.Root({}, [new yy.Literal({ value: "" })]);
					case 3:
						this.$ = new yy.Concat({}, [$$[$0 - 1], $$[$0]]);
						break;
					case 4:
					case 5:
						this.$ = $$[$0];
						break;
					case 6:
						this.$ = new yy.Literal({ value: $$[$0] });
						break;
					case 7:
						this.$ = new yy.Splat({ name: $$[$0] });
						break;
					case 8:
						this.$ = new yy.Param({ name: $$[$0] });
						break;
					case 9:
						this.$ = new yy.Optional({}, [$$[$0 - 1]]);
						break;
					case 10:
						this.$ = yytext;
						break;
					case 11:
					case 12:
						this.$ = yytext.slice(1);
						break;
				}
			},
			table: [
				{
					3: 1,
					4: 2,
					5: [1, 3],
					6: 4,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: $V0,
					13: $V1,
					14: $V2,
					15: $V3
				},
				{ 1: [3] },
				{
					5: [1, 13],
					6: 14,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: $V0,
					13: $V1,
					14: $V2,
					15: $V3
				},
				{ 1: [2, 2] },
				o($V4, [2, 4]),
				o($V4, [2, 5]),
				o($V4, [2, 6]),
				o($V4, [2, 7]),
				o($V4, [2, 8]),
				{
					4: 15,
					6: 4,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: $V0,
					13: $V1,
					14: $V2,
					15: $V3
				},
				o($V4, [2, 10]),
				o($V4, [2, 11]),
				o($V4, [2, 12]),
				{ 1: [2, 1] },
				o($V4, [2, 3]),
				{
					6: 14,
					7: 5,
					8: 6,
					9: 7,
					10: 8,
					11: $V0,
					12: [1, 16],
					13: $V1,
					14: $V2,
					15: $V3
				},
				o($V4, [2, 9])
			],
			defaultActions: {
				3: [2, 2],
				13: [2, 1]
			},
			parseError: function parseError(str, hash) {
				if (hash.recoverable) this.trace(str);
				else {
					function _parseError(msg, hash) {
						this.message = msg;
						this.hash = hash;
					}
					_parseError.prototype = Error;
					throw new _parseError(str, hash);
				}
			},
			parse: function parse(input) {
				var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
				var args = lstack.slice.call(arguments, 1);
				var lexer = Object.create(this.lexer);
				var sharedState = { yy: {} };
				for (var k in this.yy) if (Object.prototype.hasOwnProperty.call(this.yy, k)) sharedState.yy[k] = this.yy[k];
				lexer.setInput(input, sharedState.yy);
				sharedState.yy.lexer = lexer;
				sharedState.yy.parser = this;
				if (typeof lexer.yylloc == "undefined") lexer.yylloc = {};
				var yyloc = lexer.yylloc;
				lstack.push(yyloc);
				var ranges = lexer.options && lexer.options.ranges;
				if (typeof sharedState.yy.parseError === "function") this.parseError = sharedState.yy.parseError;
				else this.parseError = Object.getPrototypeOf(this).parseError;
				_token_stack: var lex = function() {
					var token = lexer.lex() || EOF;
					if (typeof token !== "number") token = self.symbols_[token] || token;
					return token;
				};
				var symbol, preErrorSymbol, state, action, r, yyval = {}, p, len, newState, expected;
				while (true) {
					state = stack[stack.length - 1];
					if (this.defaultActions[state]) action = this.defaultActions[state];
					else {
						if (symbol === null || typeof symbol == "undefined") symbol = lex();
						action = table[state] && table[state][symbol];
					}
					if (typeof action === "undefined" || !action.length || !action[0]) {
						var errStr = "";
						expected = [];
						for (p in table[state]) if (this.terminals_[p] && p > TERROR) expected.push("'" + this.terminals_[p] + "'");
						if (lexer.showPosition) errStr = "Parse error on line " + (yylineno + 1) + ":\n" + lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
						else errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == EOF ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
						this.parseError(errStr, {
							text: lexer.match,
							token: this.terminals_[symbol] || symbol,
							line: lexer.yylineno,
							loc: yyloc,
							expected
						});
					}
					if (action[0] instanceof Array && action.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
					switch (action[0]) {
						case 1:
							stack.push(symbol);
							vstack.push(lexer.yytext);
							lstack.push(lexer.yylloc);
							stack.push(action[1]);
							symbol = null;
							if (!preErrorSymbol) {
								yyleng = lexer.yyleng;
								yytext = lexer.yytext;
								yylineno = lexer.yylineno;
								yyloc = lexer.yylloc;
								if (recovering > 0) recovering--;
							} else {
								symbol = preErrorSymbol;
								preErrorSymbol = null;
							}
							break;
						case 2:
							len = this.productions_[action[1]][1];
							yyval.$ = vstack[vstack.length - len];
							yyval._$ = {
								first_line: lstack[lstack.length - (len || 1)].first_line,
								last_line: lstack[lstack.length - 1].last_line,
								first_column: lstack[lstack.length - (len || 1)].first_column,
								last_column: lstack[lstack.length - 1].last_column
							};
							if (ranges) yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
							r = this.performAction.apply(yyval, [
								yytext,
								yyleng,
								yylineno,
								sharedState.yy,
								action[1],
								vstack,
								lstack
							].concat(args));
							if (typeof r !== "undefined") return r;
							if (len) {
								stack = stack.slice(0, -1 * len * 2);
								vstack = vstack.slice(0, -1 * len);
								lstack = lstack.slice(0, -1 * len);
							}
							stack.push(this.productions_[action[1]][0]);
							vstack.push(yyval.$);
							lstack.push(yyval._$);
							newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
							stack.push(newState);
							break;
						case 3: return true;
					}
				}
				return true;
			}
		};
		parser.lexer = (function() {
			return {
				EOF: 1,
				parseError: function parseError(str, hash) {
					if (this.yy.parser) this.yy.parser.parseError(str, hash);
					else throw new Error(str);
				},
				setInput: function(input, yy) {
					this.yy = yy || this.yy || {};
					this._input = input;
					this._more = this._backtrack = this.done = false;
					this.yylineno = this.yyleng = 0;
					this.yytext = this.matched = this.match = "";
					this.conditionStack = ["INITIAL"];
					this.yylloc = {
						first_line: 1,
						first_column: 0,
						last_line: 1,
						last_column: 0
					};
					if (this.options.ranges) this.yylloc.range = [0, 0];
					this.offset = 0;
					return this;
				},
				input: function() {
					var ch = this._input[0];
					this.yytext += ch;
					this.yyleng++;
					this.offset++;
					this.match += ch;
					this.matched += ch;
					if (ch.match(/(?:\r\n?|\n).*/g)) {
						this.yylineno++;
						this.yylloc.last_line++;
					} else this.yylloc.last_column++;
					if (this.options.ranges) this.yylloc.range[1]++;
					this._input = this._input.slice(1);
					return ch;
				},
				unput: function(ch) {
					var len = ch.length;
					var lines = ch.split(/(?:\r\n?|\n)/g);
					this._input = ch + this._input;
					this.yytext = this.yytext.substr(0, this.yytext.length - len);
					this.offset -= len;
					var oldLines = this.match.split(/(?:\r\n?|\n)/g);
					this.match = this.match.substr(0, this.match.length - 1);
					this.matched = this.matched.substr(0, this.matched.length - 1);
					if (lines.length - 1) this.yylineno -= lines.length - 1;
					var r = this.yylloc.range;
					this.yylloc = {
						first_line: this.yylloc.first_line,
						last_line: this.yylineno + 1,
						first_column: this.yylloc.first_column,
						last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
					};
					if (this.options.ranges) this.yylloc.range = [r[0], r[0] + this.yyleng - len];
					this.yyleng = this.yytext.length;
					return this;
				},
				more: function() {
					this._more = true;
					return this;
				},
				reject: function() {
					if (this.options.backtrack_lexer) this._backtrack = true;
					else return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
						text: "",
						token: null,
						line: this.yylineno
					});
					return this;
				},
				less: function(n) {
					this.unput(this.match.slice(n));
				},
				pastInput: function() {
					var past = this.matched.substr(0, this.matched.length - this.match.length);
					return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
				},
				upcomingInput: function() {
					var next = this.match;
					if (next.length < 20) next += this._input.substr(0, 20 - next.length);
					return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
				},
				showPosition: function() {
					var pre = this.pastInput();
					var c = new Array(pre.length + 1).join("-");
					return pre + this.upcomingInput() + "\n" + c + "^";
				},
				test_match: function(match, indexed_rule) {
					var token, lines, backup;
					if (this.options.backtrack_lexer) {
						backup = {
							yylineno: this.yylineno,
							yylloc: {
								first_line: this.yylloc.first_line,
								last_line: this.last_line,
								first_column: this.yylloc.first_column,
								last_column: this.yylloc.last_column
							},
							yytext: this.yytext,
							match: this.match,
							matches: this.matches,
							matched: this.matched,
							yyleng: this.yyleng,
							offset: this.offset,
							_more: this._more,
							_input: this._input,
							yy: this.yy,
							conditionStack: this.conditionStack.slice(0),
							done: this.done
						};
						if (this.options.ranges) backup.yylloc.range = this.yylloc.range.slice(0);
					}
					lines = match[0].match(/(?:\r\n?|\n).*/g);
					if (lines) this.yylineno += lines.length;
					this.yylloc = {
						first_line: this.yylloc.last_line,
						last_line: this.yylineno + 1,
						first_column: this.yylloc.last_column,
						last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
					};
					this.yytext += match[0];
					this.match += match[0];
					this.matches = match;
					this.yyleng = this.yytext.length;
					if (this.options.ranges) this.yylloc.range = [this.offset, this.offset += this.yyleng];
					this._more = false;
					this._backtrack = false;
					this._input = this._input.slice(match[0].length);
					this.matched += match[0];
					token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
					if (this.done && this._input) this.done = false;
					if (token) return token;
					else if (this._backtrack) {
						for (var k in backup) this[k] = backup[k];
						return false;
					}
					return false;
				},
				next: function() {
					if (this.done) return this.EOF;
					if (!this._input) this.done = true;
					var token, match, tempMatch, index;
					if (!this._more) {
						this.yytext = "";
						this.match = "";
					}
					var rules = this._currentRules();
					for (var i = 0; i < rules.length; i++) {
						tempMatch = this._input.match(this.rules[rules[i]]);
						if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
							match = tempMatch;
							index = i;
							if (this.options.backtrack_lexer) {
								token = this.test_match(tempMatch, rules[i]);
								if (token !== false) return token;
								else if (this._backtrack) {
									match = false;
									continue;
								} else return false;
							} else if (!this.options.flex) break;
						}
					}
					if (match) {
						token = this.test_match(match, rules[index]);
						if (token !== false) return token;
						return false;
					}
					if (this._input === "") return this.EOF;
					else return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
						text: "",
						token: null,
						line: this.yylineno
					});
				},
				lex: function lex() {
					var r = this.next();
					if (r) return r;
					else return this.lex();
				},
				begin: function begin(condition) {
					this.conditionStack.push(condition);
				},
				popState: function popState() {
					if (this.conditionStack.length - 1 > 0) return this.conditionStack.pop();
					else return this.conditionStack[0];
				},
				_currentRules: function _currentRules() {
					if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
					else return this.conditions["INITIAL"].rules;
				},
				topState: function topState(n) {
					n = this.conditionStack.length - 1 - Math.abs(n || 0);
					if (n >= 0) return this.conditionStack[n];
					else return "INITIAL";
				},
				pushState: function pushState(condition) {
					this.begin(condition);
				},
				stateStackSize: function stateStackSize() {
					return this.conditionStack.length;
				},
				options: {},
				performAction: function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
					switch ($avoiding_name_collisions) {
						case 0: return "(";
						case 1: return ")";
						case 2: return "SPLAT";
						case 3: return "PARAM";
						case 4: return "LITERAL";
						case 5: return "LITERAL";
						case 6: return "EOF";
					}
				},
				rules: [
					/^(?:\()/,
					/^(?:\))/,
					/^(?:\*+\w+)/,
					/^(?::+\w+)/,
					/^(?:[\w%\-~\n]+)/,
					/^(?:.)/,
					/^(?:$)/
				],
				conditions: { "INITIAL": {
					"rules": [
						0,
						1,
						2,
						3,
						4,
						5,
						6
					],
					"inclusive": true
				} }
			};
		})();
		function Parser() {
			this.yy = {};
		}
		Parser.prototype = parser;
		parser.Parser = Parser;
		return new Parser();
	})();
	if (typeof require !== "undefined" && typeof exports !== "undefined") {
		exports.parser = parser;
		exports.Parser = parser.Parser;
		exports.parse = function() {
			return parser.parse.apply(parser, arguments);
		};
	}
}));
//#endregion
//#region ../../node_modules/route-parser/lib/route/nodes.js
var require_nodes = /* @__PURE__ */ require_auth.__commonJSMin(((exports, module) => {
	/** @module route/nodes */
	/**
	* Create a node for use with the parser, giving it a constructor that takes
	* props, children, and returns an object with props, children, and a
	* displayName.
	* @param  {String} displayName The display name for the node
	* @return {{displayName: string, props: Object, children: Array}}
	*/
	function createNode(displayName) {
		return function(props, children) {
			return {
				displayName,
				props,
				children: children || []
			};
		};
	}
	module.exports = {
		Root: createNode("Root"),
		Concat: createNode("Concat"),
		Literal: createNode("Literal"),
		Splat: createNode("Splat"),
		Param: createNode("Param"),
		Optional: createNode("Optional")
	};
}));
//#endregion
//#region ../../node_modules/route-parser/lib/route/parser.js
/**
* @module route/parser
*/
var require_parser = /* @__PURE__ */ require_auth.__commonJSMin(((exports, module) => {
	/** Wrap the compiled parser with the context to create node objects */
	var parser = require_compiled_grammar().parser;
	parser.yy = require_nodes();
	module.exports = parser;
}));
//#endregion
//#region ../../node_modules/route-parser/lib/route/visitors/create_visitor.js
var require_create_visitor = /* @__PURE__ */ require_auth.__commonJSMin(((exports, module) => {
	/**
	* @module route/visitors/create_visitor
	*/
	var nodeTypes = Object.keys(require_nodes());
	/**
	* Helper for creating visitors. Take an object of node name to handler
	* mappings, returns an object with a "visit" method that can be called
	* @param  {Object.<string,function(node,context)>} handlers A mapping of node
	* type to visitor functions
	* @return {{visit: function(node,context)}}  A visitor object with a "visit"
	* method that can be called on a node with a context
	*/
	function createVisitor(handlers) {
		nodeTypes.forEach(function(nodeType) {
			if (typeof handlers[nodeType] === "undefined") throw new Error("No handler defined for " + nodeType.displayName);
		});
		return {
			visit: function(node, context) {
				return this.handlers[node.displayName].call(this, node, context);
			},
			handlers
		};
	}
	module.exports = createVisitor;
}));
//#endregion
//#region ../../node_modules/route-parser/lib/route/visitors/regexp.js
var require_regexp = /* @__PURE__ */ require_auth.__commonJSMin(((exports, module) => {
	var createVisitor = require_create_visitor(), escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	/**
	* @class
	* @private
	*/
	function Matcher(options) {
		this.captures = options.captures;
		this.re = options.re;
	}
	/**
	* Try matching a path against the generated regular expression
	* @param  {String} path The path to try to match
	* @return {Object|false}      matched parameters or false
	*/
	Matcher.prototype.match = function(path) {
		var match = this.re.exec(path), matchParams = {};
		if (!match) return;
		this.captures.forEach(function(capture, i) {
			if (typeof match[i + 1] === "undefined") matchParams[capture] = void 0;
			else matchParams[capture] = decodeURIComponent(match[i + 1]);
		});
		return matchParams;
	};
	module.exports = createVisitor({
		"Concat": function(node) {
			return node.children.reduce(function(memo, child) {
				var childResult = this.visit(child);
				return {
					re: memo.re + childResult.re,
					captures: memo.captures.concat(childResult.captures)
				};
			}.bind(this), {
				re: "",
				captures: []
			});
		},
		"Literal": function(node) {
			return {
				re: node.props.value.replace(escapeRegExp, "\\$&"),
				captures: []
			};
		},
		"Splat": function(node) {
			return {
				re: "([^?]*?)",
				captures: [node.props.name]
			};
		},
		"Param": function(node) {
			return {
				re: "([^\\/\\?]+)",
				captures: [node.props.name]
			};
		},
		"Optional": function(node) {
			var child = this.visit(node.children[0]);
			return {
				re: "(?:" + child.re + ")?",
				captures: child.captures
			};
		},
		"Root": function(node) {
			var childResult = this.visit(node.children[0]);
			return new Matcher({
				re: new RegExp("^" + childResult.re + "(?=\\?|$)"),
				captures: childResult.captures
			});
		}
	});
}));
//#endregion
//#region ../../node_modules/route-parser/lib/route/visitors/reverse.js
var require_reverse = /* @__PURE__ */ require_auth.__commonJSMin(((exports, module) => {
	module.exports = require_create_visitor()({
		"Concat": function(node, context) {
			var childResults = node.children.map(function(child) {
				return this.visit(child, context);
			}.bind(this));
			if (childResults.some(function(c) {
				return c === false;
			})) return false;
			else return childResults.join("");
		},
		"Literal": function(node) {
			return decodeURI(node.props.value);
		},
		"Splat": function(node, context) {
			if (context[node.props.name]) return context[node.props.name];
			else return false;
		},
		"Param": function(node, context) {
			if (context[node.props.name]) return context[node.props.name];
			else return false;
		},
		"Optional": function(node, context) {
			var childResult = this.visit(node.children[0], context);
			if (childResult) return childResult;
			else return "";
		},
		"Root": function(node, context) {
			context = context || {};
			var childResult = this.visit(node.children[0], context);
			if (!childResult) return false;
			return encodeURI(childResult);
		}
	});
}));
//#endregion
//#region ../../node_modules/route-parser/lib/route.js
var require_route = /* @__PURE__ */ require_auth.__commonJSMin(((exports, module) => {
	var Parser = require_parser(), RegexpVisitor = require_regexp(), ReverseVisitor = require_reverse();
	Route.prototype = Object.create(null);
	/**
	* Match a path against this route, returning the matched parameters if
	* it matches, false if not.
	* @example
	* var route = new Route('/this/is/my/route')
	* route.match('/this/is/my/route') // -> {}
	* @example
	* var route = new Route('/:one/:two')
	* route.match('/foo/bar/') // -> {one: 'foo', two: 'bar'}
	* @param  {string} path the path to match this route against
	* @return {(Object.<string,string>|false)} A map of the matched route
	* parameters, or false if matching failed
	*/
	Route.prototype.match = function(path) {
		var matched = RegexpVisitor.visit(this.ast).match(path);
		return matched ? matched : false;
	};
	/**
	* Reverse a route specification to a path, returning false if it can't be
	* fulfilled
	* @example
	* var route = new Route('/:one/:two')
	* route.reverse({one: 'foo', two: 'bar'}) -> '/foo/bar'
	* @param  {Object} params The parameters to fill in
	* @return {(String|false)} The filled in path
	*/
	Route.prototype.reverse = function(params) {
		return ReverseVisitor.visit(this.ast, params);
	};
	/**
	* Represents a route
	* @example
	* var route = Route('/:foo/:bar');
	* @example
	* var route = Route('/:foo/:bar');
	* @param {string} spec -  the string specification of the route.
	*     use :param for single portion captures, *param for splat style captures,
	*     and () for optional route branches
	* @constructor
	*/
	function Route(spec) {
		var route;
		if (this) route = this;
		else route = Object.create(Route.prototype);
		if (typeof spec === "undefined") throw new Error("A route spec is required");
		route.spec = spec;
		route.ast = Parser.parse(spec);
		return route;
	}
	module.exports = Route;
}));
//#endregion
//#region ../../node_modules/route-parser/index.js
/**
* @module Passage
*/
var require_route_parser = /* @__PURE__ */ require_auth.__commonJSMin(((exports, module) => {
	module.exports = require_route();
}));
//#endregion
//#region src/switch/fromHistory.ts
function fromHistory(target, contextLabel = HISTORY_CONTEXT_DEFAULT) {
	return new require_auth.FromService(target, contextLabel);
}
//#endregion
//#region src/switch/switch.ts
var switch_exports = /* @__PURE__ */ require_auth.__exportAll({
	Element: () => Switch,
	Switch: () => Switch
});
var import_route_parser = /* @__PURE__ */ require_auth.__toESM(require_route_parser(), 1);
var Switch = class extends HTMLElement {
	constructor(routes) {
		super();
		this.viewModel = require_view.createViewModel({ authenticated: false }).with(require_auth.fromAuth(this), "authenticated", "username").with(fromHistory(this), "location");
		this._cases = [];
		this._routeView = require_html.html`
    <h1>Routing...</h1>
  `;
		this._routeViewModel = require_view.createViewModel({
			params: {},
			query: new URLSearchParams()
		});
		this._cases = routes.map((r) => ({
			...r,
			route: new import_route_parser.default(r.path)
		}));
		this.viewModel.createEffect(($) => {
			if ($.location) {
				const nextView = this.routeToView($.location, $.authenticated, $.username);
				if (nextView !== this._routeView) {
					this._routeView = nextView;
					require_html.shadow(this).replace(this._routeViewModel.render(nextView));
				}
			}
		});
	}
	routeToView(location, authenticated = false, username) {
		const m = this.matchRoute(location);
		if (m) {
			if ("view" in m) if (m.auth && m.auth !== "public" && !authenticated) {
				require_auth.dispatch(this, "auth/redirect");
				return require_html.html`
            <h1>Redirecting for Login</h1>
          `;
			} else {
				this._routeViewModel.update({
					params: m.params,
					query: m.query,
					user: {
						authenticated,
						username
					}
				});
				return m.view;
			}
			if ("redirect" in m) {
				const redirect = m.redirect;
				if (typeof redirect === "string") {
					this.redirect(redirect);
					return require_html.html`
            <h1>Redirecting to ${redirect}…</h1>
          `;
				}
			}
		}
		return require_html.html`
      <h1>Not Found</h1>
    `;
	}
	matchRoute(location) {
		const { search, pathname } = location;
		const query = new URLSearchParams(search);
		const path = pathname + search;
		for (const option of this._cases) {
			const params = option.route.match(path);
			if (params) return {
				...option,
				path: pathname,
				params,
				query
			};
		}
	}
	redirect(href) {
		dispatch(this, "history/redirect", { href });
	}
};
//#endregion
Object.defineProperty(exports, "fromHistory", {
	enumerable: true,
	get: function() {
		return fromHistory;
	}
});
Object.defineProperty(exports, "history_exports", {
	enumerable: true,
	get: function() {
		return history_exports;
	}
});
Object.defineProperty(exports, "switch_exports", {
	enumerable: true,
	get: function() {
		return switch_exports;
	}
});
