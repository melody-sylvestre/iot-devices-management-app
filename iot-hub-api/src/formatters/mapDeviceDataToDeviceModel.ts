import type { Device } from "@prisma/client";
import { defaultDevice } from "../definitions/constants";
import { DEVICE_VALIDATION_RULES } from "../definitions/types";

import * as z from "zod";

export const mapDeviceDataToDeviceModel = (deviceData: any): Device => {
  if (!Object.keys(DEVICE_VALIDATION_RULES).includes(deviceData?.type)) {
    const message = `Error: ${deviceData?.type} is not a supported device type.`;
    throw new Error(message);
  }

  //TODO: maybe add a step like schema = DEVICE_VALIDATION_RULES[
  //   deviceData.type as keyof typeof DEVICE_VALIDATION_RULES
  // ] and rebuild a  stricter validation schema using z.stricObject and .shape?
  //

  const validDeviceData =
    DEVICE_VALIDATION_RULES[
      deviceData.type as keyof typeof DEVICE_VALIDATION_RULES
    ].safeParse(deviceData);

  if (!validDeviceData.success) {
    const message = z.prettifyError(validDeviceData.error);
    throw new Error(message);
  }
  const deviceAsDeviceType = { ...defaultDevice, ...deviceData };
  return deviceAsDeviceType;
};
