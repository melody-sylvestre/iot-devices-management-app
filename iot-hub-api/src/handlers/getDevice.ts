import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";

export const getDevice = async (request: Request, response: Response) => {
  const id = request.params.id;
  let device;

  console.log(`Fetching device id ${id}`);

  try {
    device = await prismaClient.device.findUnique({ where: { id } });

    if (!device) {
      response.status(404).json({
        message: `There is no device with id ${id} in the database.`,
        data: null,
      });
      return;
    }

    response.status(200).json({
      message: `Successfully fetched ${device?.name}.`,
      data: device,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while fetching the device.";

    response.status(500).json({
      message: `Device with ID ${id} could not be fetched. ${errorMessage}`,
      data: null,
    });
  }

  return;
};
