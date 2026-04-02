"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var mongoose_1 = require("mongoose");
var credentialSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    roles: [
        {
            $role: { type: String, required: true },
            groupid: String
        }
    ]
}, { collection: "user_credentials" });
var credentialModel = (0, mongoose_1.model)("Credential", credentialSchema);
function verify(username, password) {
    return credentialModel
        .find({ username: username })
        .then(function (found) {
        if (!found || found.length !== 1)
            throw "Invalid username or password";
        return found[0];
    })
        .then(function (credsOnFile) {
        return bcryptjs_1.default.compare(password, credsOnFile.hashedPassword)
            .then(function (result) {
            if (!result)
                throw ("Invalid username or password");
            return credsOnFile.username;
        });
    });
}
function create(username, password) {
    return credentialModel
        .find({ username: username })
        .then(function (found) {
        if (found.length)
            throw "Username exists: ".concat(username);
    })
        .then(function () {
        return bcryptjs_1.default
            .genSalt(10)
            .then(function (salt) { return bcryptjs_1.default.hash(password, salt); })
            .then(function (hashedPassword) {
            var creds = new credentialModel({
                username: username,
                hashedPassword: hashedPassword
            });
            return creds.save();
        });
    });
}
exports.default = { create: create, verify: verify };
