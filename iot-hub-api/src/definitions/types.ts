import * as z from "zod";

// FIXME: is there a way to make this dry-er?
const DEVICE_TYPES = ["Thermostat", "Light Switch"] as const;
type DeviceType = "Thermostat" | "Light Switch";

export const deviceSchema = z
  .object({
    id: z.uuid(),
    name: z.string().trim().min(1).max(30), //TODO: make sure that this rejects (" ")
    type: z.enum(DEVICE_TYPES),
    is_enabled: z.boolean(),
  })
  .required();

// NOTE: All devices validation schemas mut be defined as extension of the device schema

export const thermostatSchema = deviceSchema.extend({
  ...deviceSchema.shape,
  current_value_1: z.number().nullable(),
  target_value_1: z.number().gte(5).lte(30).nullable(),
});

export const lightSwitchSchema = deviceSchema.extend({
  ...deviceSchema.shape,
  is_on: z.boolean(),
});

export type DeviceRequest = z.infer<typeof deviceSchema>;

export const DEVICE_VALIDATION_RULES: Record<DeviceType, z.ZodSchema> = {
  Thermostat: thermostatSchema,
  "Light Switch": lightSwitchSchema,
};
