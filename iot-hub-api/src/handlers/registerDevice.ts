import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { v4 } from "uuid";
import { validateAndMapNewDataToDeviceModel } from "../validators";
import { Prisma } from "@prisma/client";

export const registerDevice = async (request: Request, response: Response) => {
  console.log("Parsing new device details...");

  const data = request.body;
  let newDevice;

  try {
    newDevice = validateAndMapNewDataToDeviceModel(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while validating the details of the new device.";
    console.log(errorMessage);

    response.status(400).json({ message: errorMessage, data: null });
    return;
  }

  console.log("Attempting to add new device to the database.");

  newDevice.id = v4();
  let registeredDevice;
  let message;

  try {
    registeredDevice = await prismaClient.device.create({
      data: { ...newDevice },
    });

    message = "Successfully registered new device";
    console.log(message);

    response.status(201).json({
      message: message,
      data: registeredDevice,
    });
  } catch (error) {
    // Handling separately cases where the error was caused by trying to register a device with an existing name
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      message = `Error: the name ${newDevice.name} is already present in the database and cannot be duplicated.`;
      console.log(message);

      response.status(400).json({
        message: message,
        data: null,
      });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : "";
    message = `Error: impossible to register the new device. ${errorMessage}`;
    console.log(message);

    response.status(500).json({
      message: message,
      data: null,
    });
  }
  return;
};
