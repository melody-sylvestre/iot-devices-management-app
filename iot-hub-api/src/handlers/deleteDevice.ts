import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";

export const deleteDevice = async (request: Request, response: Response) => {
  const id = request.params.id;
  let deletedDevice;

  console.log(`Attempting device id ${id} deletion.`);

  try {
    deletedDevice = await prismaClient.device.delete({ where: { id } });
    response.status(200).json({
      message: `${deletedDevice.name} was successfully deleted`,
      data: null,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while deleting the device.";

    response.status(500).json({
      message: `Device with ID ${id} could not be deleted. ${errorMessage}`,
      data: null,
    });
  }

  return;
};
