import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { v4 } from "uuid";
import { validateAndMapNewDataToDeviceModel } from "../validators";

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
    response.status(400).json({ message: errorMessage, data: null });
    return;
  }

  console.log("Attempting to add new device to the database.");

  newDevice.id = v4();
  let registeredDevice;

  try {
    registeredDevice = await prismaClient.device.create({
      data: { ...newDevice },
    });
    response.status(201).json({
      message: "Successfully registered new device",
      data: registeredDevice,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    response.status(500).json({
      message: `Error: impossible to register the new device. ${errorMessage}`,
      data: null,
    });
  }
  return;
};
