import { Device } from "@prisma/client";
import { v4 } from "uuid";

export const testDevices: Array<Partial<Device>> = [
  {
    id: v4(),
    name: "Kitchen Light",
    type: "Light Switch",
    is_enabled: true,
    is_on: false,
  },
  {
    id: v4(),
    name: "Master Bedroom Thermostat",
    type: "Thermostat",
    is_enabled: false,
    current_value_1: 13,
    target_value_1: 15,
  },
];
