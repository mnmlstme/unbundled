"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("./auth");
var traveler_svc_1 = __importDefault(require("../services/traveler-svc"));
var router = express_1.default.Router();
router.get("/", function (_, res) {
    traveler_svc_1.default
        .index()
        .then(function (list) { return res.json(list); })
        .catch(function (err) { return res.status(500).send(err); });
});
router.get("/:userid", function (req, res) {
    var userid = req.params.userid;
    traveler_svc_1.default
        .get(userid)
        .then(function (traveler) { return res.json(traveler); })
        .catch(function (err) { return res.status(404).send(err); });
});
router.put("/:userid", (0, auth_1.authorizeUser)(function (req, username) {
    return username === req.params.userid;
}), function (req, res) {
    var userid = req.params.userid;
    var editedtraveler = req.body;
    traveler_svc_1.default
        .update(userid, editedtraveler)
        .then(function (traveler) { return res.json(traveler); })
        .catch(function (err) { return res.status(404).send(err); });
});
router.post("/", (0, auth_1.authorizeUser)(function (req, username) {
    var userid = req.body.userid;
    if (userid && userid !== username)
        return false;
    req.body.userid = username;
    return true;
}), function (req, res) {
    var newtraveler = req.body;
    traveler_svc_1.default
        .create(newtraveler)
        .then(function (traveler) {
        return res.status(201).send(traveler);
    })
        .catch(function (err) { return res.status(500).send(err); });
});
router.delete("/:userid", function (req, res) {
    var userid = req.params.userid;
    traveler_svc_1.default
        .remove(userid)
        .then(function () { return res.status(204).end(); })
        .catch(function (err) { return res.status(404).send(err); });
});
exports.default = router;
