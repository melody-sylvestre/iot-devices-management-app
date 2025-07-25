import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";

export const getDevice = async (request: Request, response: Response) => {
  const id = request.params.id;
  let device;
  let message;

  console.log(`Fetching device id ${id}`);

  try {
    device = await prismaClient.device.findUnique({ where: { id } });

    if (!device) {
      message = `Error: there is no device with id ${id} in the database.`;
      console.log(message);

      response.status(404).json({
        message: message,
        data: null,
      });

      return;
    }

    message = `Successfully fetched ${device?.name}.`;
    console.log(message);

    response.status(200).json({
      message: message,
      data: device,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while fetching the device.";

    message = `Error: device with ID ${id} could not be fetched. ${errorMessage}`;
    console.log(message);

    response.status(500).json({
      message: message,
      data: null,
    });
  }

  return;
};
