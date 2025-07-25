import { registerDevice } from "./registerDevice";
import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { validateAndMapNewDataToDeviceModel } from "../validators";
import { testDevices } from "../testUtils/devices";
import { Prisma } from "@prisma/client";

jest.mock("../prisma/client");

describe("registerDevice", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("It returns a 201 status and the new record in the JSON response if the request is valid", async () => {
    const newDeviceData = testDevices[0];
    const createdDbRecord = validateAndMapNewDataToDeviceModel(newDeviceData);

    const req = {
      body: newDeviceData,
    };

    jest.mocked(prismaClient.device.create).mockResolvedValue(createdDbRecord);

    await registerDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully registered new device",
      data: createdDbRecord,
    });
  });

  test("It returns 400 status if the request body has an incorrect format", async () => {
    const req = {
      body: {
        name: "New Device",
        type: "random",
        is_enabled: true,
      },
    };

    await registerDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error: random is not a supported device type.",
      data: null,
    });
  });

  test("If the device was not created because there is already another device with the same name in the database, it returns a 400 status and JSON object with an error message.", async () => {
    const newDevice = testDevices[0];

    const req = {
      body: newDevice,
    };

    jest.mocked(prismaClient.device.create).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Duplicate name", {
        code: "P2002",
        clientVersion: "6.12.0",
      })
    );
    await registerDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: the name ${newDevice.name} is already present in the database and cannot be duplicated.`,
      data: null,
    });
  });

  test("It returns 500 if the new record can't be created in the devices table", async () => {
    const newDevice = testDevices[0];

    const req = {
      body: newDevice,
    };

    jest
      .mocked(prismaClient.device.create)
      .mockRejectedValue(new Error("Error message."));

    await registerDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: impossible to register the new device. Error message.`,
      data: null,
    });
  });
});
