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
    let allDevicesFormattedData = [];

    for (const device of allDevices) {
      let data;

      try {
        data = mapDeviceModelToDeviceData(device);
      } catch (e) {
        //NOTE: this will trigger if some database records become somehow inconsistent with the validation schema
        let errorMessage =
          e instanceof Error ? e.message : "met an error while formatting data";
        formattingErrors += `${device.id}: ${errorMessage} `;
        continue;
      }
      allDevicesFormattedData.push(data);
    }

    if (formattingErrors) {
      console.log(formattingErrors);
      message = `Found ${allDevicesFormattedData.length} valid devices and ${
        allDevices.length - allDevicesFormattedData.length
      } invalid records. ${formattingErrors}`;
      statusCode = 500;
    }

    response.status(statusCode).json({
      message: message,
      data: allDevicesFormattedData,
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
