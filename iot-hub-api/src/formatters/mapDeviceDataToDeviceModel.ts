import type { Device } from "@prisma/client";
import { defaultDevice } from "../definitions/constants";
import { deviceSchema } from "../definitions/types";
import * as z from "zod";

export const mapDeviceDataToDeviceModel = (
  deviceData: Partial<Device>
): Device => {
  const validDeviceData = deviceSchema.safeParse(deviceData);

  if (!validDeviceData.success) {
    const message = z.prettifyError(validDeviceData.error);
    throw new Error(message);
  }

  const deviceAsDeviceType = { ...defaultDevice, ...deviceData };
  return deviceAsDeviceType;
};
