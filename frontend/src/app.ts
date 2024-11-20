import express from "express";
import helmet from "helmet";
import https from "https";
import session from "./middleware/session.js";
import { readFileSync } from "fs";
import { isAuthenticated } from "./middleware/auth.js";
import LoginRouter from "./router/login.js";
import LogoutRouter from "./router/logout.js";
import RegisterRouter from "./router/register.js";

if (process.env.DEBUG_MODE == "true") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const app = express();
const port = 443;
const options = {
  key: readFileSync("/app/certs/local.key"),
  cert: readFileSync("/app/certs/local.crt")
};

app.use(helmet());

app.set("trust proxy", 1);
app.use(session());

app.set("view engine", "ejs");
app.set("views", "/app/views");

app.use(express.json());

app.use(isAuthenticated());

app.use("/login", LoginRouter);
app.use("/logout", LogoutRouter);
app.use("/register", RegisterRouter);

app.get("/", (_, res) => {
  res.render("index", { title: "Sharkoders" });
});

app.get("/challenges", (_, res) => { 
  res.render("challenges", { title: "Sharkoders - Challenges" })  
});

app.get("/actus", (_, res) => { 
  res.render("actus", { title: "Sharkoders - Actualités" })  
});

https.createServer(options, app).listen(port, () => {
  console.log(`Listening to port ${port}`);
});