import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { mapDeviceDataToDeviceModel } from "../formatters";

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

  let newRecord = { ...existingRecord, ...updateData };
  let newValidatedRecord;

  // TODO: maybe I'll have to rename mapDeviceDataToDeviceModel
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

  try {
    updatedRecord = await prismaClient.device.update({
      where: { id },
      data: newValidatedRecord,
    });
    response.status(200).json({
      message: `Successfully updated device ${updatedRecord.name} (id: ${id}).`,
      data: updatedRecord,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    response.status(500).json({
      message: `Could not update device id ${id}. ${errorMessage}`,
      data: null,
    });
    return;
  }

  return;
};
