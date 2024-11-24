import express from "express";
import { readFileSync } from "fs";
import helmet from "helmet";
import https from "https";
import LoginRouter from "./router/login.js";
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
app.use(express.json());

app.use("/login", LoginRouter);
app.use("/register", RegisterRouter);

app.get("/", (_, res) => { res.sendStatus(418) });

https.createServer(options, app).listen(port, () => {
  console.log(`Listening to port ${port}`);
});