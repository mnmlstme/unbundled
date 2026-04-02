"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
exports.authorizeUser = authorizeUser;
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var credential_svc_1 = __importDefault(require("../services/credential-svc"));
var router = express_1.default.Router();
dotenv_1.default.config();
var TOKEN_SECRET = process.env.TOKEN_SECRET || "NOT_A_SECRET";
function generateAccessToken(username) {
    console.log("Generating token for", username);
    return new Promise(function (resolve, reject) {
        jsonwebtoken_1.default.sign({ username: username }, TOKEN_SECRET, { expiresIn: "1d" }, function (error, token) {
            if (error)
                reject(error);
            else {
                resolve(token);
            }
        });
    });
}
router.post("/register", function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password; // from form
    if (typeof username !== "string" || typeof password !== "string") {
        res.status(400).send("Bad request: Invalid input data.");
    }
    else {
        credential_svc_1.default
            .create(username, password)
            .then(function (creds) { return generateAccessToken(creds.username); })
            .then(function (token) {
            res.status(201).send({ token: token });
        })
            .catch(function (err) {
            res.status(409).send({ error: err.message });
        });
    }
});
router.post("/login", function (req, res) {
    var _a = req.body, username = _a.username, password = _a.password; // from form
    if (typeof username !== "string" || typeof password !== "string") {
        res.status(400).send("Bad request: Invalid input data.");
    }
    else {
        credential_svc_1.default
            .verify(username, password)
            .then(function (goodUser) { return generateAccessToken(goodUser); })
            .then(function (token) { return res.status(200).send({ token: token }); })
            .catch(function () { return res.status(401).send("Unauthorized"); });
    }
});
function authenticateUser(req, res, next) {
    var authHeader = req.headers["authorization"];
    //Getting the 2nd part of the auth header (the token)
    var token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).end();
    }
    else {
        jsonwebtoken_1.default.verify(token, TOKEN_SECRET, function (_, decoded) {
            if (decoded) {
                req.jwtPayload = decoded;
                next();
            }
            else {
                res.status(401).end();
            }
        });
    }
}
function authorizeUser(checkFn) {
    var middleware = function (req, res, next) {
        var username = req.jwtPayload.username;
        console.log("Checking auth for user", username);
        if (checkFn(req, username))
            next();
        else
            res.status(403).send();
    };
    return middleware;
}
exports.default = router;
