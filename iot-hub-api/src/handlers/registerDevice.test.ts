import { registerDevice } from "./registerDevice";
import type { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { mapDeviceDataToDeviceModel } from "../formatters";
import { testDevices } from "../testUtils/devices";

jest.mock("../prisma/client");

describe("registerDevice", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("It returns a 201 status and the new record in the JSON response if the request is valid", async () => {
    const newDevice = testDevices[0];

    const req = {
      body: newDevice,
    };

    jest
      .mocked(prismaClient.device.create)
      .mockResolvedValue(mapDeviceDataToDeviceModel(newDevice));

    await registerDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Successfully registered new device",
      data: newDevice,
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

  // TODO: Write this test
  test("It returns 400 status if there is already a record with the same name", async () => {});

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
