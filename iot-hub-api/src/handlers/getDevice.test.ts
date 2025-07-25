import { Request, Response } from "express";
import { prismaClient } from "../prisma/client";
import { testDevices } from "../testUtils/devices";
import { defaultDevice } from "../definitions/constants";
import { getDevice } from "./getDevice";
import { v4 } from "uuid";

jest.mock("../prisma/client");

describe("getDevice", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  test("If the database record exist, it returns a status 200 and a JSON object with success message and the device record", async () => {
    const id = v4();
    const dbRecord = { ...defaultDevice, ...testDevices[0], id: id };
    const req = { params: { id } } as Partial<Request>;

    jest.mocked(prismaClient.device.findUnique).mockResolvedValue(dbRecord);
    await getDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Successfully fetched ${dbRecord.name}.`,
      data: dbRecord,
    });
  });

  test("If the database record does not exist, it returns a status 404 and a JSON object with an error message", async () => {
    const id = v4();
    const req = { params: { id } } as Partial<Request>;

    jest.mocked(prismaClient.device.findUnique).mockResolvedValue(null);
    await getDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `There is no device with id ${id} in the database.`,
      data: null,
    });
  });

  test("If there is an issue while fetching the record from the database, it returns a status 500 and a JSON object with an error message", async () => {
    const id = v4();
    const req = { params: { id } } as Partial<Request>;

    jest
      .mocked(prismaClient.device.findUnique)
      .mockRejectedValue(new Error("Database error."));
    await getDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Device with ID ${id} could not be fetched. Database error.`,
      data: null,
    });
  });
});
