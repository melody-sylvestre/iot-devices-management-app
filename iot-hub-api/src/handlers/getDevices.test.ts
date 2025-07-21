import { Request, Response } from "express";
import { getDevices } from "./getDevices";
import { testDevices } from "../testUtils/devices";
import { prismaClient } from "../prisma/client";
import { mapDeviceDataToDeviceModel } from "../formatters/mapDeviceDataToDeviceModel";
import { mapDeviceModelToDeviceData } from "../formatters";
import { v4 } from "uuid";

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

    await getDevices(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Found ${testDevices.length} devices.`,
      data: testDevices,
    });
  });

  test("If there are no devices record in the database, it returns an empty list with a 200 status.", async () => {
    const req = {} as any as Request;
    jest.mocked(prismaClient.device.findMany).mockResolvedValue([]);

    await getDevices(req, res as Response);

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

    await getDevices(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error: could not retrieve list of devices. Error message!",
      data: null,
    });
  });

  test("If some records are inconsistent with the validation rules, it returns the valid records, a 500 status and an error message with the id of the invalid records", async () => {
    const validDbRecord = mapDeviceDataToDeviceModel(testDevices[0]);
    const id = v4();
    const invalidDbRecord = {
      ...mapDeviceDataToDeviceModel(testDevices[1]),
      type: "Obsolete device",
      id: id,
    };
    const dbRecords = [validDbRecord, invalidDbRecord];

    const req = {} as any as Request;
    jest.mocked(prismaClient.device.findMany).mockResolvedValue(dbRecords);

    await getDevices(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Found 1 valid devices and 1 invalid records. ${id}: Error: Obsolete device is not a supported device type. `,
      data: [mapDeviceModelToDeviceData(validDbRecord)],
    });
  });
});
