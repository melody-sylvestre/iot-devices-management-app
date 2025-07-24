import * as z from "zod";

const DEVICE_TYPES = ["Thermostat", "Light Switch"] as const;
type DeviceType = "Thermostat" | "Light Switch";

// NOTE: All devices validation schemas mut be defined as extension of the device schema

export const deviceSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(30),
  type: z.enum(DEVICE_TYPES),
  is_enabled: z.boolean(),
});

export const thermostatSchema = deviceSchema
  .extend({
    ...deviceSchema.shape,
    current_value_1: z.number().nullable(),
    target_value_1: z.number().gte(5).lte(30).nullable(),
  })
  .strict()
  .catchall(z.null());

export const lightSwitchSchema = deviceSchema
  .extend({
    ...deviceSchema.shape,
    is_on: z.boolean(),
  })
  .strict()
  .catchall(z.null());

export const DEVICE_VALIDATION_RULES: Record<DeviceType, z.ZodSchema> = {
  Thermostat: thermostatSchema,
  "Light Switch": lightSwitchSchema,
};
