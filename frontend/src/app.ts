import express from "express";
import helmet from "helmet";
import https from "https";
import session from "./middleware/session.js";
import { readFileSync } from "fs";

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

app.get("/", (_, res) => { 
  res.render("index", { title: "Sharkoders" })  
});

app.get("/challenges", (_, res) => { 
  res.render("challenges", { title: "Sharkoders - Challenges" })  
});

app.get("/actus", (_, res) => { 
  res.render("actus", { title: "Sharkoders - Actualités" })  
});

app.get("/login", (_, res) => { 
  res.render("login", { title: "Sharkoders - Connection" })  
});

app.get("/register", (_, res) => { 
  res.render("register", { title: "Sharkoders - Inscription" })  
});

https.createServer(options, app).listen(port, () => {
  console.log(`Listening to port ${port}`);
});