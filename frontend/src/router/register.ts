import { RequestHandler, Router } from "express";

const RegisterRouter = Router();

/**
 * Renders the register page if user is not authenticated.
 * @param req The request object.
 * @param res The response object.
 */
const renderRegisterPage: RequestHandler = (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/account");
    return;
  }

  res.render("register", { title: "Sharkoders - Inscription" });
};

/**
 * Try to register to website.
 * @param req The request object.
 * @param res The response object.
 */
const register: RequestHandler = async (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/account");
    return;
  }

  if (req.body.username == undefined || req.body.password == undefined) {
    res.status(400);
    res.json({ error: "Fields 'username' and 'password' must be all set." });
    return;
  }

  const response = await fetch("https://backend/register", {
    method: "POST",
    body: JSON.stringify({
      username: req.body.username,
      password: req.body.password
    })
  });

  if (response.status != 200) {
    res.status(400);
    res.json({ error: "Username already registered." });
    return;
  }

  req.session = await response.json();
  res.redirect("/create-totp");
  return;
};

RegisterRouter.get("/", renderRegisterPage);
RegisterRouter.post("/", register);

export default RegisterRouter;