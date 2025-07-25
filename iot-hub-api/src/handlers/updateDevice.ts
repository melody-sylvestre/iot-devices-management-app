import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { mapDeviceDataToDeviceModel } from "../formatters";

export const updateDevice = async (request: Request, response: Response) => {
  const id = request.params.id;
  const updateData = request.body;

  console.log("Fetching existing record");
  let existingRecord;

  try {
    existingRecord = await prismaClient.device.findUnique({ where: { id } });

    if (!existingRecord) {
      response.status(404).json({
        message: `There is no device with id ${id} in the database.`,
        data: null,
      });
      return;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    response.status(500).json({
      message: `Impossible to fetch device id ${id} from database. ${errorMessage}`,
      data: null,
    });
    return;
  }

  let newRecord = { ...existingRecord, ...updateData };
  let newValidatedRecord;

  // TODO: maybe I'll have to rename mapDeviceDataToDeviceModel
  console.log("Validating update");
  try {
    newValidatedRecord = mapDeviceDataToDeviceModel(newRecord);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    response.status(400).json({
      message: `Invalid update request: ${errorMessage}`,
      data: null,
    });
    return;
  }

  let updatedRecord;
  console.log("Attempting update");
  try {
    updatedRecord = await prismaClient.device.update({
      where: { id },
      data: newValidatedRecord,
    });
    response.status(200).json({
      message: `Successfully updated device ${updatedRecord.name} (id ${id}).`,
      data: updatedRecord,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    console.log(errorMessage);

    response.status(500).json({
      message: `Could not update device ${existingRecord.name} (id ${id}). ${errorMessage}`,
      data: null,
    });
    return;
  }

  return;
};
