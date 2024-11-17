import { RequestHandler, Router } from "express";

const LoginRouter = Router();

/**
 * Renders the login page if user is not authenticated.
 * @param req The request object.
 * @param res The response object.
 */
const renderLoginPage: RequestHandler = (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/account");
    return;
  }

  res.render("login", { title: "Sharkoders - Connection" });
};

/**
 * Renders the login page if user is not authenticated.
 * @param req The request object.
 * @param res The response object.
 */
const renderLoginTOTPPage: RequestHandler = (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/account");
    return;
  }

  res.render("login-totp", { title: "Sharkoders - Connection TOTP" });
};

/**
 * Try to login to website.
 * @param req The request object.
 * @param res The response object.
 */
const login: RequestHandler = async (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/account");
    return;
  }

  if (req.body.username == undefined || req.body.password == undefined) {
    res.status(400);
    res.json({ error: "Fields 'username' and 'password' must be all set." });
    return;
  }

  const response = await fetch("https://backend/login", {
    method: "POST",
    body: JSON.stringify({
      username: req.body.username,
      password: req.body.password
    })
  });

  if (response.status != 200) {
    res.status(400);
    res.json({ error: "Wrong username or password." });
    return;
  }

  req.session = await response.json();
  res.redirect("/account");
  return;
};

/**
 * Try to login to website using totp.
 * @param req The request object.
 * @param res The response object.
 */
const loginTOTP: RequestHandler = async (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/account");
    return;
  }

  if (req.body.username == undefined || req.body.totp == undefined) {
    res.status(400);
    res.json({ error: "Fields 'username' and 'totp' must be all set." });
    return;
  }

  const response = await fetch("https://backend/login", {
    method: "POST",
    body: JSON.stringify({
      username: req.body.username,
      totp: req.body.totp
    })
  });

  if (response.status != 200) {
    res.status(400);
    res.json({ error: "Wrong username or totp." });
    return;
  }

  req.session = await response.json();
  res.redirect("/account");
  return;
};

LoginRouter.get("/", renderLoginPage);
LoginRouter.get("/totp", renderLoginTOTPPage);
LoginRouter.post("/", login);
LoginRouter.post("/totp", loginTOTP);

export default LoginRouter;