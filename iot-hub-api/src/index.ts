import express from "express";
import { healthCheck } from "./handlers/health.ts";
import { getDevices } from "./handlers/getDevices.ts";

const app = express();

// Routes
//TODELETE:
app.get("/health", healthCheck);
app.get("/devices", getDevices);

console.log("iot hub api is ready");
// IDEA: add port in config file?
app.listen(3000);
