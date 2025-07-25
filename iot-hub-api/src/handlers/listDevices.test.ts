import { Request, Response } from "express";
import { listDevices } from "./listDevices";
import { testDevices } from "../testUtils/devices";
import { prismaClient } from "../prisma/client";
import { mapDeviceDataToDeviceModel } from "../formatters/mapDeviceDataToDeviceModel";
jest.mock("../prisma/client.ts");

describe("getDevices", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("If there are devices records in the database and they are all valid, it returns them as a list with a 200 status.", async () => {
    const req = {} as any as Request;
    const testDevicesAsDbRecords = testDevices.map((device) => {
      return mapDeviceDataToDeviceModel(device);
    });
    jest
      .mocked(prismaClient.device.findMany)
      .mockResolvedValue(testDevicesAsDbRecords);

    await listDevices(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Found ${testDevicesAsDbRecords.length} devices.`,
      data: testDevicesAsDbRecords,
    });
  });

  test("If there are no device record in the database, it returns an empty list with a 200 status.", async () => {
    const req = {} as any as Request;
    jest.mocked(prismaClient.device.findMany).mockResolvedValue([]);

    await listDevices(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Found 0 devices.",
      data: [],
    });
  });

  test("It returns null and a 500 status if records could not be fetched from the database.", async () => {
    const req = {} as any as Request;
    jest
      .mocked(prismaClient.device.findMany)
      .mockRejectedValue(new Error("Error message!"));

    await listDevices(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error: could not retrieve list of devices. Error message!",
      data: null,
    });
  });
});
