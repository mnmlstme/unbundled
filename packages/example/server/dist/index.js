"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importStar(require("./routes/auth"));
var travelers_1 = __importDefault(require("./routes/travelers"));
var tours_1 = __importDefault(require("./routes/tours"));
var mongo_1 = require("./services/mongo");
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
// Mongo Connection
(0, mongo_1.connect)("blazing");
// Static files
var staticDir = process.env.STATIC || "public";
console.log("Serving static files from ", staticDir);
app.use(express_1.default.static(staticDir));
// Middleware:
app.use(express_1.default.json({ limit: "500kb" }));
// Auth routes
app.use("/auth", auth_1.default);
// API routes:
app.use("/api/tours", auth_1.authenticateUser, tours_1.default);
app.use("/api/travelers", auth_1.authenticateUser, travelers_1.default);
// Page Routes:
app.get("/ping", function (_, res) {
    res.send("<h1>Hello!</h1>\n     <p>Server is up and running.</p>\n     <p>Serving static files from <code>".concat(staticDir, "</code>.</p>\n    "));
});
// Start the server
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
});
