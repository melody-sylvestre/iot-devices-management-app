import { DEVICE_VALIDATION_RULES } from "../definitions/types";
import { Device } from "@prisma/client";
import * as z from "zod";
export const mapDeviceModelToDeviceData = (dbRecord: Device) => {
  if (!Object.keys(DEVICE_VALIDATION_RULES).includes(dbRecord.type)) {
    const message = `Error: ${dbRecord.type} is not a supported device type.`;
    throw new Error(message);
  }

  const deviceData =
    DEVICE_VALIDATION_RULES[
      dbRecord.type as keyof typeof DEVICE_VALIDATION_RULES
    ].safeParse(dbRecord);

  if (!deviceData.success) {
    const message = `Error: could not parse the data following the ${
      dbRecord.type
    } schema: \n ${z.prettifyError(deviceData.error)}`;
    throw new Error(message);
  }

  return deviceData.data;
};
