import { Device } from "@prisma/client";

export const testDevices: Array<Partial<Device>> = [
  {
    name: "Kitchen Light",
    type: "Light Switch",
    is_enabled: true,
    is_on: false,
  },
  {
    name: "Master Bedroom Thermostat",
    type: "Thermostat",
    is_enabled: false,
    current_value_1: 13,
    target_value_1: 15,
  },
];
