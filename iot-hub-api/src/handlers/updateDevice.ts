import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { mapDeviceModelToDeviceData } from "../formatters";
import { DEVICE_VALIDATION_RULES } from "../definitions/types";

export const updateDevice = async (request: Request, response: Response) => {
  const id = request.params.id;
  const updateData = request.body;

  let existingRecord;
  try {
    existingRecord = await prismaClient.device.findUnique({ where: { id } });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    response.status(500).json({
      message: `Impossible to fetch device id ${id} from database. ${errorMessage}`,
      data: null,
    });
    return;
  }
  //FIXME: find how to validate update object
  //FIXME: this will change depending on how I would parse dbRecord into device data
  //FIXME: also if the dbrecord is not valid then I can't parse it???
  let newRecord = { ...existingRecord, ...updateData };

  if (!Object.keys(DEVICE_VALIDATION_RULES).includes(newRecord.type)) {
    const message = `Error: ${newRecord.type} is not a supported device type.`;
    response.status(500).json({
      message: message,
      data: null,
    });
    return;
  }

  try {
    DEVICE_VALIDATION_RULES[
      newRecord.type as keyof typeof DEVICE_VALIDATION_RULES
    ].parse(newRecord);
  } catch {}

  //TODO:
  // build update with existing record  as device data + update and parse following type
  // -> if fail: return 400
  // attempt  update
  // return 200 or 500 following results
};
