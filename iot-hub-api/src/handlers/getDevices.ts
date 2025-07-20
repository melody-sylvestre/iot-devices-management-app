import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { mapDeviceModelToDeviceData } from "../formatters";

//TODO: what logic if some db record can't be parsed?

export const getDevices = async (_request: Request, response: Response) => {
  console.log("Fetching devices list...");
  let allDevices = [];
  let message = "";
  let statusCode = 200;

  try {
    allDevices = await prismaClient.device.findMany();
    message = `Found ${allDevices.length} devices.`;
    console.log(message);

    let formattingErrors = "";
    const allDevicesFormattedData = allDevices.map((device) => {
      let data;
      try {
        data = mapDeviceModelToDeviceData(device);
      } catch (e) {
        let errorMessage =
          e instanceof Error ? e.message : "met an error while formatting data";
        formattingErrors += `${device.id}: ${errorMessage} ; `;
      }
      return data;
    });

    if (formattingErrors) {
      console.log(formattingErrors);
      statusCode = 500;
    }

    response.status(200).json({
      message: message,
      data: allDevicesFormattedData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "";
    message = `Error: could not retrieve list of devices. ${errorMessage}`;
    console.log(message);
    console.log(error);

    response.status(500).json({
      message: message,
      data: null,
    });
  }

  return;
};
