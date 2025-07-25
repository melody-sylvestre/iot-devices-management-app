import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { Prisma } from "@prisma/client";

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
    // Handling separately cases where the error was caused by trying to delete a non-existent record.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      response.status(404).json({
        message: `Error: device with ID ${id} was not found in the database.`,
        data: null,
      });
      return;
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while deleting the device.";

    response.status(500).json({
      message: `Error: device with ID ${id} could not be deleted. ${errorMessage}`,
      data: null,
    });
  }

  return;
};
