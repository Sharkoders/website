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

  const username: string = (req.body.username as string ?? "").trim();
  const password: string = (req.body.password as string ?? "").trim();

  if (username == "" || password == "") {
    res.status(400);
    res.json({ error: "Veuillez renseigner tout les champs requis." });
    return;
  }

  const response = await fetch("https://backend/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (response.status != 200) {
    res.status(400);
    res.json({ error: "Identifiants incorrects." });
    return;
  }

  req.session = await response.json();
  res.setHeader("Location", "/account");
  res.sendStatus(200)
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

  const username: string = (req.body.username as string ?? "").trim();
  const totpString: string = (req.body.totp as string ?? "").trim();

  if (username == "" || totpString == "") {
    res.status(400);
    res.json({ error: "Veuillez renseigner tout les champs requis." });
    return;
  }

  const totp = Number.parseInt(totpString);
  if (Number.isNaN(totp)) {
    res.status(400);
    res.json({ error: "Le TOTP fourni doit être un nombre." });
    return;
  }

  const response = await fetch("https://backend/login/totp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, totp })
  });

  if (response.status != 200) {
    res.status(400);
    res.json({ error: "Identifiants incorrects." });
    return;
  }

  req.session = await response.json();
  res.setHeader("Location", "/account");
  res.sendStatus(200)
  return;
};

LoginRouter.get("/", renderLoginPage);
LoginRouter.get("/totp", renderLoginTOTPPage);
LoginRouter.post("/", login);
LoginRouter.post("/totp", loginTOTP);

export default LoginRouter;