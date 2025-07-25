import express from "express";
import {
  deleteDevice,
  getDevice,
  listDevices,
  registerDevice,
  updateDevice,
} from "./handlers";

const app = express();

app.use(express.json());

// Routes
app.get("/devices", listDevices);
app.post("/devices", registerDevice);
app.get("/devices/:id", getDevice);
app.put("/devices/:id", updateDevice);
app.delete("/devices/:id", deleteDevice);

console.log("iot-hub API is ready");

// IDEA: add port in config file?
app.listen(3000);
