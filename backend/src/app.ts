import express from "express";
import { readFileSync } from "fs";
import https from "https";

const app = express();
const port = 443;
const options = {
  key: readFileSync("/app/certs/local.key"),
  cert: readFileSync("/app/certs/local.crt")
};

app.get("/", (_, res) => { res.sendStatus(418) });

https.createServer(options, app).listen(port, () => {
  console.log(`Listening to port ${port}`);
});