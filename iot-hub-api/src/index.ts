import express from "express";
import cors from "cors";
import {
  deleteDevice,
  getDevice,
  listDevices,
  registerDevice,
  updateDevice,
} from "./handlers";

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

// Routes
app.get("/devices", listDevices);
app.post("/devices", registerDevice);
app.get("/devices/:id", getDevice);
app.put("/devices/:id", updateDevice);
app.delete("/devices/:id", deleteDevice);

console.log(`iot-hub API is ready and listening on port ${port}`);

app.listen(port);
