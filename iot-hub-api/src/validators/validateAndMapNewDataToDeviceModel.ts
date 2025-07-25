import type { Device } from "@prisma/client";
import { defaultDevice } from "../definitions/constants";
import { DEVICE_VALIDATION_RULES } from "../definitions/types";

import * as z from "zod";

export const validateAndMapNewDataToDeviceModel = (deviceData: any): Device => {
  if (!Object.keys(DEVICE_VALIDATION_RULES).includes(deviceData?.type)) {
    const message = `Error: ${deviceData?.type} is not a supported device type.`;
    throw new Error(message);
  }

  const validDevice =
    DEVICE_VALIDATION_RULES[
      deviceData.type as keyof typeof DEVICE_VALIDATION_RULES
    ].safeParse(deviceData);

  if (!validDevice.success) {
    const message = z.prettifyError(validDevice.error);
    throw new Error(message);
  }

  //Actually, validData is always an object because it is the result of zod.safeParse, but Typescript needs an additional type check here.
  const validData =
    validDevice.data && typeof validDevice.data === "object"
      ? validDevice.data
      : {};

  const deviceAsDeviceType = { ...defaultDevice, ...validData };
  return deviceAsDeviceType;
};
