import type { Device } from "@prisma/client";
import { defaultDevice } from "../definitions/constants";
import { deviceSchema } from "../definitions/types";
import { formatZodErrors } from "./formatZodErrors";

export const mapDeviceDataToDeviceModel = (
  deviceData: Partial<Device>
): Device => {
  const validDeviceData = deviceSchema.safeParse(deviceData);

  if (!validDeviceData.success) {
    const message = formatZodErrors(validDeviceData.error);
    throw new Error(message);
  }

  const deviceAsDeviceType = { ...defaultDevice, ...deviceData };
  return deviceAsDeviceType;
};
