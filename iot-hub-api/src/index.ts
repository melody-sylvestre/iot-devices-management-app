import express from "express";
import { deleteDevice, getDevices, registerDevice } from "./handlers";

const app = express();

app.use(express.json());

// Routes
app.get("/devices", getDevices);
app.post("/devices", registerDevice);
app.delete("/devices/:id", deleteDevice);

console.log("iot-hub API is ready");

// IDEA: add port in config file?
app.listen(3000);
