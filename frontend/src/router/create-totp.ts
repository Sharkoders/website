import { RequestHandler, Router } from "express";
import { requireAuthentication } from "../middleware/auth.js";

const CreateTOTPRouter = Router();
CreateTOTPRouter.use(requireAuthentication());

/**
 * Renders the register page if user is not authenticated.
 * @param req The request object.
 * @param res The response object.
 */
const renderTOTPPage: RequestHandler = (req, res) => {
  res.render("create-totp", { title: "Sharkoders - Création TOTP" });
};

/**
 * Try to register to website.
 * @param req The request object.
 * @param res The response object.
 */
const saveTOTPSeed: RequestHandler = async (req, res) => {
  const seed: string = (req.body.seed as string ?? "").trim();
  const totp: string = (req.body.totp as string ?? "").trim();

  if (seed == "" || totp == "") {
    res.status(400);
    res.json({ error: "Veuillez renseigner tout les champs requis." });
    return;
  }

  const response = await fetch("https://backend/totp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ seed, totp })
  });

  if (response.status != 200) {
    res.status(400);
    res.json({ error: "Mauvais TOTP." });
    return;
  }

  req.session = await response.json();
  res.setHeader("Location", "/account");
  res.sendStatus(200)
  return;
};

CreateTOTPRouter.get("/", renderTOTPPage);
CreateTOTPRouter.post("/", saveTOTPSeed);

export default CreateTOTPRouter;