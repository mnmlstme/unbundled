import express, { Request, Response } from "express";
import { authorizeUser } from "./auth";
import { Traveler } from "../models/traveler";

import travelers from "../services/traveler-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  travelers
    .index()
    .then((list: Traveler[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params as { userid: string };

  travelers
    .get(userid)
    .then((traveler: Traveler) => res.json(traveler))
    .catch((err) => res.status(404).send(err));
});

router.put(
  "/:userid",
  authorizeUser(
    (req: Request, username: string) =>
      username === req.params.userid
  ),
  (req: Request, res: Response) => {
    const { userid } = req.params as { userid: string };
    const editedtraveler = req.body;

    travelers
      .update(userid, editedtraveler)
      .then((traveler: Traveler) => res.json(traveler))
      .catch((err) => res.status(404).send(err));
  }
);

router.post(
  "/",
  authorizeUser((req: Request, username: string) => {
    const { userid } = req.body;
    if (userid && userid !== username) return false;
    req.body.userid = username;
    return true;
  }),
  (req: Request, res: Response) => {
    const newtraveler = req.body;

    travelers
      .create(newtraveler)
      .then((traveler: Traveler) =>
        res.status(201).send(traveler)
      )
      .catch((err) => res.status(500).send(err));
  }
);

router.delete("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params as {userid : string };

  travelers
    .remove(userid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
