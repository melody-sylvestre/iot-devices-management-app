import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client";

export const listDevices = async (_request: Request, response: Response) => {
  console.log("Fetching devices list...");
  let allDevices = [];
  let message = "";

  try {
    allDevices = await prismaClient.device.findMany();
    message = `Found ${allDevices.length} devices.`;
    console.log(message);

    response.status(200).json({
      message: message,
      data: allDevices,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    message = `Error: could not retrieve list of devices. ${errorMessage}`;
    console.log(message);

    response.status(500).json({
      message: message,
      data: null,
    });
  }

  return;
};
