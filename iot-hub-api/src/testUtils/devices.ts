import type { Device } from "../types.ts";
import { v4 } from "uuid";

export const testDevices: Array<Device> = [
  {
    id: v4(),
    name: "Kitchen Light",
    type: "LIGHT SWITCH",
    is_enabled: true,
  },
  {
    id: v4(),
    name: "Master Bedroom Thermostat",
    type: "THERMOSTAT",
    is_enabled: false,
  },
];
