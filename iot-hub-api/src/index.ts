import express from "express";
import { getDevices } from "./handlers";
// import { registerDevice } from "./handlers";

const app = express();

app.use(express.json());

// Routes
app.get("/devices", getDevices);
// sapp.post("/devices", registerDevice);

console.log("iot-hub API is ready");
// IDEA: add port in config file?
app.listen(3000);
