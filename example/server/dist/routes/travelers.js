import express from "express";
import { authorizeUser } from "./auth.js";
import travelers from "../services/traveler-svc.js";
const router = express.Router();
router.get("/", (_, res) => {
    travelers
        .index()
        .then((list) => res.json(list))
        .catch((err) => res.status(500).send(err));
});
router.get("/:userid", (req, res) => {
    const { userid } = req.params;
    travelers
        .get(userid)
        .then((traveler) => res.json(traveler))
        .catch((err) => res.status(404).send(err));
});
router.put("/:userid", authorizeUser((req, username) => username === req.params.userid), (req, res) => {
    const { userid } = req.params;
    const editedtraveler = req.body;
    travelers
        .update(userid, editedtraveler)
        .then((traveler) => res.json(traveler))
        .catch((err) => res.status(404).send(err));
});
router.post("/", authorizeUser((req, username) => {
    const { userid } = req.body;
    if (userid && userid !== username)
        return false;
    req.body.userid = username;
    return true;
}), (req, res) => {
    const newtraveler = req.body;
    travelers
        .create(newtraveler)
        .then((traveler) => res.status(201).send(traveler))
        .catch((err) => res.status(500).send(err));
});
router.delete("/:userid", (req, res) => {
    const { userid } = req.params;
    travelers
        .remove(userid)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});
export default router;
