import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client.ts";

export const getDevices = async (request: Request, response: Response) => {
  let allDevices = [];

  try {
    allDevices = await prismaClient.device.findMany();
    response.status(200).json({
      message: `Found ${allDevices.length} devices.`,
      data: allDevices,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Error: could not retrieve list of devices.",
      data: [],
    });
  }

  return;
};
