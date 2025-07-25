import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { validateAndMapNewDataToDeviceModel } from "../validators";
import { Prisma } from "@prisma/client";

export const updateDevice = async (request: Request, response: Response) => {
  const id = request.params.id;
  const updateData = request.body;

  console.log("Fetching existing record");
  let existingRecord;
  let message;

  try {
    existingRecord = await prismaClient.device.findUnique({ where: { id } });

    if (!existingRecord) {
      message = `Error: there is no device with id ${id} in the database.`;
      console.log(message);

      response.status(404).json({
        message: message,
        data: null,
      });
      return;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    message = `Error: impossible to fetch device id ${id} from database. ${errorMessage}`;
    console.log(message);

    response.status(500).json({
      message: message,
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
    message = `Error: invalid update request. ${errorMessage}`;
    console.log(message);

    response.status(400).json({
      message: message,
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

    message = `Successfully updated device ${updatedRecord.name} (id ${id}).`;
    console.log(message);

    response.status(200).json({
      message: message,
      data: updatedRecord,
    });
  } catch (error) {
    // Handling separately cases where the error was caused by trying to update a device with an existing name or id
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      message = `Error: the name ${newValidatedRecord.name} or the id ${newValidatedRecord.id} is already present in the database and cannot be duplicated.`;
      console.log(message);

      response.status(400).json({
        message: message,
        data: null,
      });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : "";
    message = `Error: could not update device ${existingRecord.name} (id ${id}). ${errorMessage}`;
    console.log(message);

    response.status(500).json({
      message: message,
      data: null,
    });
    return;
  }

  return;
};
