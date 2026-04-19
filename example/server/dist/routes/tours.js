"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var tour_svc_1 = __importDefault(require("../services/tour-svc"));
var router = express_1.default.Router();
router.get("/", function (req, res) {
    var userid = req.query.userid;
    if (!userid) {
        res.status(400).send("requires ?userid=");
        return;
    }
    tour_svc_1.default
        .index(userid)
        .then(function (list) {
        return res.status(200).send({
            count: list.length,
            data: list
        });
    })
        .catch(function (err) { return res.status(500).send(err); });
});
router.post("/", function (req, res) {
    var newTour = req.body;
    tour_svc_1.default
        .create(newTour)
        .then(function (tour) { return res.status(201).send(tour); })
        .catch(function (err) { return res.status(500).send(err); });
});
router.get("/:id", function (req, res) {
    var id = req.params.id;
    tour_svc_1.default
        .get(id)
        .then(function (tour) {
        if (!tour)
            throw "Not found";
        else
            res.json(tour);
    })
        .catch(function () { return res.status(404).end(); });
});
router.put("/:id", function (req, res) {
    var id = req.params.id;
    var newTour = req.body;
    tour_svc_1.default
        .update(id, newTour)
        .then(function (tour) { return res.json(tour); })
        .catch(function () { return res.status(404).end(); });
});
router.get("/:id/destinations/:n", function (req, res) {
    var _a = req.params, id = _a.id, n = _a.n;
    tour_svc_1.default
        .getDestination(id, parseInt(n))
        .then(function (destination) {
        return res.status(200).json(destination);
    })
        .catch(function () { return res.status(404).end(); });
});
router.put("/:id/destinations/:n", function (req, res) {
    var _a = req.params, id = _a.id, n = _a.n;
    var newDest = req.body;
    console.log("User", req.params.username);
    console.log("Updating Destination ".concat(n, " of tour ").concat(id, " with"), newDest);
    tour_svc_1.default
        .updateDestination(id, parseInt(n), newDest)
        .then(function (dest) { return res.json(dest); })
        .catch(function () { return res.status(404).end(); });
});
exports.default = router;
