import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { validateAndMapNewDataToDeviceModel } from "../validators";
import { Prisma } from "@prisma/client";

export const updateDevice = async (request: Request, response: Response) => {
  const id = request.params.id;
  const updateData = request.body;

  console.log("Fetching existing record");
  let existingRecord;

  try {
    existingRecord = await prismaClient.device.findUnique({ where: { id } });

    if (!existingRecord) {
      response.status(404).json({
        message: `Error: there is no device with id ${id} in the database.`,
        data: null,
      });
      return;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    response.status(500).json({
      message: `Error: impossible to fetch device id ${id} from database. ${errorMessage}`,
      data: null,
    });
    return;
  }

  let newRecord = { ...existingRecord, ...updateData };
  let newValidatedRecord;

  console.log("Validating update");
  try {
    newValidatedRecord = validateAndMapNewDataToDeviceModel(newRecord);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    response.status(400).json({
      message: `Error: invalid update request. ${errorMessage}`,
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
    // Handling separately cases where the error was caused by trying to update a device with an existing name or id
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      response.status(400).json({
        message: `Error: the name ${newValidatedRecord.name} or the id ${newValidatedRecord.id} is already present in the database and cannot be duplicated.`,
        data: null,
      });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : "";
    console.log(errorMessage);

    response.status(500).json({
      message: `Error: could not update device ${existingRecord.name} (id ${id}). ${errorMessage}`,
      data: null,
    });
    return;
  }

  return;
};
