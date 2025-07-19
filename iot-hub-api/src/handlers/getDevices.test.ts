import { Request, Response } from "express";
import { getDevices } from "./getDevices";
import { testDevices } from "../testUtils/devices.ts";
import { prismaClient } from "../prisma/client";
jest.mock("../prisma/client.ts");

describe("getDevices", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("If there are devices records in the database, it returns them as a list with a 200 status.", async () => {
    const req = {} as any as Request;
    jest.mocked(prismaClient.device.findMany).mockResolvedValue(testDevices);

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
      .mockRejectedValue(new Error("Error!"));

    await getDevices(req, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error: could not retrieve list of devices.",
      data: [],
    });
  });
});
