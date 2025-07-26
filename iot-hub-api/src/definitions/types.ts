import * as z from "zod";

//NOTE: add any new Device type to these variables
const DEVICE_TYPES = ["Thermostat", "Light Switch", "Security Camera"] as const;
type DeviceType = "Thermostat" | "Light Switch" | "Security Camera";

// NOTE: All devices validation schemas mut be defined from requiredDevicePropertiesSchema and optionalDevicePropertiesSchema

// This variable defines all the properties that are mandatory for any type of device
const requiredDevicePropertiesSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1).max(30),
  type: z.enum(DEVICE_TYPES),
  is_enabled: z.boolean(),
});

// This variable defines the properties that can be nullable depending on the device type.
const optionalDevicePropertiesSchema = z.object({
  is_on: z.null().optional(),
  current_value_1: z.null().optional(),
  target_value_1: z.null().optional(),
  setting_as_int_scale_1: z.null().optional(),
  setting_as_string_1: z.null().optional(),
});

const thermostatSchema = z.strictObject({
  ...requiredDevicePropertiesSchema.shape,
  ...optionalDevicePropertiesSchema.shape,
  current_value_1: z.number().nullable(),
  target_value_1: z.number().gte(5).lte(30).nullable(),
});

const lightSwitchSchema = z.strictObject({
  ...requiredDevicePropertiesSchema.shape,
  ...optionalDevicePropertiesSchema.shape,
  is_on: z.boolean().nullable(),
});

const securityCameraSchema = z.strictObject({
  ...requiredDevicePropertiesSchema.shape,
  ...optionalDevicePropertiesSchema.shape,
  is_on: z.boolean(),
  setting_as_string_1: z.url().nullable(), //URL where the video of the camera is livestreamed
});

// NOTE: Any new device type MUST be added to the variable below in order to be supported by the API.
export const DEVICE_VALIDATION_RULES: Record<DeviceType, z.ZodSchema> = {
  Thermostat: thermostatSchema,
  "Light Switch": lightSwitchSchema,
  "Security Camera": securityCameraSchema,
};
