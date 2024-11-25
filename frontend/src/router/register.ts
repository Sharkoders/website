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
  
  const email: string = (req.body.email as string ?? "").trim();
  const username: string = (req.body.username as string ?? "").trim();
  const password: string = (req.body.password as string ?? "").trim();

  if (email == "" || username == "" || password == "") {
    res.status(400);
    res.json({ error: "Veuillez renseigner tout les champs requis." });
    return;
  }

  const response = await fetch("https://backend/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, username, password })
  });

  if (response.status != 200) {
    res.status(400);
    res.json(await response.json());
    return;
  }

  req.session = await response.json();
  res.setHeader("Location", "/create-totp");
  res.sendStatus(201)
  return;
};

RegisterRouter.get("/", renderRegisterPage);
RegisterRouter.post("/", register);

export default RegisterRouter;