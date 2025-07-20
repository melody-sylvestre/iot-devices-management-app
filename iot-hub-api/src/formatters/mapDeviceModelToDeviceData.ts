import { DEVICE_VALIDATION_RULES } from "../definitions/types";
import { Device } from "@prisma/client";
import { formatZodErrors } from "./formatZodErrors";

export const mapDeviceModelToDeviceData = (dbRecord: Device) => {
  const deviceData =
    DEVICE_VALIDATION_RULES[
      dbRecord.type as keyof typeof DEVICE_VALIDATION_RULES
    ].safeParse(dbRecord);

  if (!deviceData.success) {
    const message = formatZodErrors(deviceData.error);
    throw new Error(message);
  }

  return deviceData.data;
};
