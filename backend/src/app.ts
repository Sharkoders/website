import express from "express";
import { readFileSync } from "fs";
import helmet from "helmet";
import https from "https";
import LoginRouter from "./router/login.js";

const app = express();
const port = 443;
const options = {
  key: readFileSync("/app/certs/local.key"),
  cert: readFileSync("/app/certs/local.crt")
};

app.use(helmet());
app.use(express.json());

app.use("/login", LoginRouter);

app.get("/", (_, res) => { res.sendStatus(418) });

https.createServer(options, app).listen(port, () => {
  console.log(`Listening to port ${port}`);
});