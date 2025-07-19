import express from "express";
import { getDevices } from "./handlers/index.ts";

const app = express();

app.use(express.json());

// Routes
app.get("/devices", getDevices);

console.log("iot hub API is ready");
// IDEA: add port in config file?
app.listen(3000);
