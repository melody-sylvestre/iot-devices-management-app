import type { Request, Response } from "express";
import { validateAndParseNewDevice } from "../validators/validateAndParseNewDevice";
import { Device } from "@prisma/client";
// FIXME: fix imports to commonjs so that I can use the type from prisma
// import type { DeviceRequest } from "../types";
import { prismaClient } from "../prisma/client";
import { v4 } from "uuid";

export const registerDevice = async (request: Request, response: Response) => {
  const data = request.body;
  const new_id = v4();
  let newDevice;
  try {
    newDevice = validateAndParseNewDevice(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occured while validating the details of the new device.";
    response.status(400).json({ message: errorMessage, data: null });
    return;
  }

  let registeredDevice: Device;

  try {
    registeredDevice = await prismaClient.device.create({
      data: {
        id: new_id,
        name: newDevice.name,
        type: newDevice.type,
        is_enabled: newDevice.is_enabled,
        Thermostat: {
          create: {
            current_value: null,
            target_value: null,
          },
        },
      },
    });
    response.status(201).json({
      message: "Successfully registered new device",
      data: registeredDevice,
    });
  } catch (error) {
    response.status(500).json({
      message: "Error: impossible to register the new device",
      data: null,
    });
  }

  return;

  // (validate unique name?) - should be done by Prisma

  // transaction with:
  //    create record in devices - get id
  //    create record in matching table
  // return new record
};

// const buildCreateRequest = (newDevice: DeviceRequest) => {
//   const newID = v4();
// };
