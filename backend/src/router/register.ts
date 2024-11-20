import { RequestHandler, Router } from "express";
import * as argon2 from "argon2";
import db from "../data/database.js";

const RegisterRouter = Router();

/**
 * Try and register user.
 * @param req The request object
 * @param res The response object
 */
const register: RequestHandler = async (req, res) => {
  const users = db.collection("users");
  
  const userByEmail = await users.findOne({
    email: req.body.email
  }, {
    projection: { email: 1 }
  });

  if (userByEmail != null) {
    res.status(400);
    res.json({ error: "Email déjà utilisé." });
    return;
  }

  const userByUsername = await users.findOne({
    username: req.body.username
  }, {
    projection: { username: 1 }
  });

  if (userByUsername != null) {
    res.status(400);
    res.json({ error: "Pseudo déjà utilisé." });
    return;
  }

  const response = await users.insertOne({
    username: req.body.username,
    password: argon2.hash(req.body.password),
    email: req.body.email
  });

  if (!response.acknowledged) {
    res.status(500);
    res.json({ error: "Problème lors de l'inscription de l'utilisateur, veuillez contacter un membre du club." });
    return;
  }
  
  res.json({
    _id: response.insertedId,
    username: req.body.username,
    email: req.body.email
  });
}

RegisterRouter.post("/", register);

export default RegisterRouter;