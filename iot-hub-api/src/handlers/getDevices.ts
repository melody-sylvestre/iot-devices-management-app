import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client";

export const getDevices = async (_request: Request, response: Response) => {
  // TODO: add sme logging
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
      data: null,
    });
  }

  return;
};
