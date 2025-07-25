import { validateAndMapNewDataToDeviceModel } from "../validators";
import { prismaClient } from "../prisma/client";
import { testDevices } from "../testUtils/devices";
import { deleteDevice } from "./deleteDevice";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

jest.mock("../prisma/client");

describe("deleteDevice", () => {
  let res: Partial<Response>;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("If the device was deleted successfully, it returns a 200 status and a JSON object with a message confirming its deletion.", async () => {
    const deletedDevice = validateAndMapNewDataToDeviceModel(testDevices[0]);
    const req = { params: { id: deletedDevice.id } } as Partial<Request>;

    jest.mocked(prismaClient.device.delete).mockResolvedValue(deletedDevice);
    await deleteDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `${deletedDevice.name} was successfully deleted`,
      data: null,
    });
  });

  test("If the device was not deleted because it is not in the database, it returns a 404 status and JSON object wtith an error message.", async () => {
    const deletedDevice = validateAndMapNewDataToDeviceModel(testDevices[0]);
    const req = { params: { id: deletedDevice.id } } as Partial<Request>;

    jest.mocked(prismaClient.device.delete).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        "No record was found for a delete",
        {
          code: "P2025",
          clientVersion: "6.12.0",
        }
      )
    );
    await deleteDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: device with ID ${deletedDevice.id} was not found in the database.`,
      data: null,
    });
  });

  test("If the device was not deleted for any other reason, it returns a 500 status and JSON object wtith an error message.", async () => {
    const deletedDevice = validateAndMapNewDataToDeviceModel(testDevices[0]);
    const req = { params: { id: deletedDevice.id } } as Partial<Request>;

    jest
      .mocked(prismaClient.device.delete)
      .mockRejectedValue(new Error("Error message."));
    await deleteDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: device with ID ${deletedDevice.id} could not be deleted. Error message.`,
      data: null,
    });
  });
});
