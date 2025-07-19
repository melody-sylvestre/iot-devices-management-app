import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client.ts";

export const getDevices = async (request: Request, response: Response) => {
  const allDevices = await prismaClient.device.findMany();

  response
    .status(200)
    .json({ message: `Found ${allDevices.length} devices`, data: allDevices });
};
