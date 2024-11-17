import { RequestHandler, Router } from "express";
import * as argon2 from "argon2";
import db from "../data/database.js";
import { totp } from "../data/totp.js";

const LoginRouter = Router();

/**
 * Try and connect user.
 * @param req The request object
 * @param res The response object
 */
const login: RequestHandler = async (req, res) => {
  const users = db.collection("users");
  const user = await users.findOne({
    "$or": [
      { email: req.body.username },
      { username: req.body.username }
    ]
  }, {
    projection: { username: 1, password: 1, email: 1 }
  });

  if (user == null) {
    res.sendStatus(400);
    return;
  }
  
  if (await argon2.verify(user.password, req.body.password)) {
    delete user.password;
    res.json(user);
  }
  else {
    res.sendStatus(400);
  }
}

/**
 * Try and connect user using totp.
 * @param req The request object
 * @param res The response object
 */
const loginTOTP: RequestHandler = async (req, res) => {
  const users = db.collection("users");
  const user = await users.findOne({
    "$or": [
      { email: req.body.username },
      { username: req.body.username }
    ]
  }, {
    projection: { username: 1, totpSeed: 1, email: 1 }
  });

  if (user == null) {
    res.sendStatus(400);
    return;
  }
  
  if (user.totpSeed == undefined) {
    res.sendStatus(400);
    return;
  }

  // Allow for ±5 seconds
  let lowerTOTP = totp(user.totpSeed, -5);
  let upperTOTP = totp(user.totpSeed, 5);

  if (req.body.totp == lowerTOTP || req.body.totp == upperTOTP) {
    delete user.totpSeed;
    res.json(user);
  }
  else {
    res.sendStatus(400);
  }
}

LoginRouter.post("/", login);
LoginRouter.post("/totp", loginTOTP);

export default LoginRouter;