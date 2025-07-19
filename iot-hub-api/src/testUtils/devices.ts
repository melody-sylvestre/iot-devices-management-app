import type { Device } from "../types.ts";
import { v4 } from "uuid";

export const testDevices: Array<Device> = [
  {
    id: v4(),
    name: "Kitchen Light",
    type: "Light Switch",
    is_enabled: true,
  },
  {
    id: v4(),
    name: "Master Bedroom Thermostat",
    type: "Thermostat",
    is_enabled: false,
  },
];

export const newTestDevice = {
  name: "Test",
  type: "Thermostat",
  is_enabled: true,
};
