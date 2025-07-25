import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import credentials from "../services/credential-svc";

export type JwtPayload = { username: string };
export type AuthenticatedRequest = Request & {
  jwtPayload: JwtPayload;
};

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

function generateAccessToken(username: string): Promise<String> {
  console.log("Generating token for", username);
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else {
          resolve(token as string);
        }
      }
    );
  });
}

router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .create(username, password)
      .then((creds) => generateAccessToken(creds.username))
      .then((token) => {
        res.status(201).send({ token: token });
      })
      .catch((err) => {
        res.status(409).send({ error: err.message });
      });
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, password)
      .then((goodUser: string) => generateAccessToken(goodUser))
      .then((token) => res.status(200).send({ token: token }))
      .catch(() => res.status(401).send("Unauthorized"));
  }
});

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (_, decoded) => {
      if (decoded) {
        (req as AuthenticatedRequest).jwtPayload = decoded as JwtPayload;
        next();
      } else {
        res.status(401).end();
      }
    });
  }
}

export function authorizeUser(
  checkFn: (req: Request, username: string) => boolean
) {
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    const { username } = (req as AuthenticatedRequest).jwtPayload;
    console.log("Checking auth for user", username);
    if (checkFn(req, username)) next();
    else res.status(403).send();
  };
  return middleware;
}

export default router;
