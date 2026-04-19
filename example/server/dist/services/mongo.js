"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
var dotenv_1 = __importDefault(require("dotenv"));
var mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("debug", true);
dotenv_1.default.config();
function getMongoURI(dbname) {
    var connection_string = "mongodb://localhost:27017/".concat(dbname);
    var _a = process.env, MONGO_USER = _a.MONGO_USER, MONGO_PWD = _a.MONGO_PWD, MONGO_CLUSTER = _a.MONGO_CLUSTER;
    if (MONGO_USER && MONGO_PWD && MONGO_CLUSTER) {
        console.log("Connecting to MongoDB at", "mongodb+srv://".concat(MONGO_USER, ":<password>@").concat(MONGO_CLUSTER, "/").concat(dbname));
        connection_string = "mongodb+srv://".concat(MONGO_USER, ":").concat(MONGO_PWD, "@").concat(MONGO_CLUSTER, "/").concat(dbname, "?retryWrites=true&w=majority");
    }
    else {
        console.log("Connecting to MongoDB at ", connection_string);
    }
    return connection_string;
}
function connect(dbname) {
    mongoose_1.default
        .connect(getMongoURI(dbname))
        .catch(function (error) { return console.log(error); });
}
