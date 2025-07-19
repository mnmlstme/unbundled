import express, { Request, Response } from "express";
import { authorizeUser } from "./auth";
import { Profile } from "../models/profile";

import profiles from "../services/profile-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  profiles
    .index()
    .then((list: Profile[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  profiles
    .get(userid)
    .then((profile: Profile) => res.json(profile))
    .catch((err) => res.status(404).send(err));
});

router.put(
  "/:userid",
  authorizeUser(
    (req: Request, username: string) => username === req.params.userid
  ),
  (req: Request, res: Response) => {
    const { userid } = req.params;
    const editedProfile = req.body;

    profiles
      .update(userid, editedProfile)
      .then((profile: Profile) => res.json(profile))
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
    const newProfile = req.body;

    profiles
      .create(newProfile)
      .then((profile: Profile) => res.status(201).send(profile))
      .catch((err) => res.status(500).send(err));
  }
);

router.delete("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  profiles
    .remove(userid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
