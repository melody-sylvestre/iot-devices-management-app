import * as z from "zod";

export type Device = {
  id: string;
  name: string;
  type: string;
  is_enabled: boolean;
};

const DEVICE_TYPES = ["Thermostat", "Light Switch"] as const;

export const newDeviceSchema = z.strictObject({
  name: z.string().trim().min(1).max(30), //TODO: make sure that this rejects (" ")
  type: z.enum(DEVICE_TYPES),
  is_enabled: z.boolean(),
});

export type DeviceRequest = z.infer<typeof newDeviceSchema>;
