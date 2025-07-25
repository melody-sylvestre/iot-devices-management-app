import type { Device } from "@prisma/client";

export const defaultDevice: Device = {
  id: "",
  name: "",
  type: "",
  is_enabled: false,
  is_on: null,
  current_value_1: null,
  target_value_1: null,
  setting_as_int_scale_1: null,
  setting_as_string_1: null,
};
