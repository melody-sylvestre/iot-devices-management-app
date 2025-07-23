import { mapDeviceDataToDeviceModel } from "../formatters";
import { prismaClient } from "../prisma/client";
import { testDevices } from "../testUtils/devices";
import { deleteDevice } from "./deleteDevice";
import { Request, Response } from "express";

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
    const deletedDevice = mapDeviceDataToDeviceModel(testDevices[0]);
    const req = { params: { id: deletedDevice.id } } as Partial<Request>;

    jest.mocked(prismaClient.device.delete).mockResolvedValue(deletedDevice);
    await deleteDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `${deletedDevice.name} was successfully deleted`,
      data: null,
    });
  });
  test("If the device was not deleted, it returns a 500 status and JSON object wtith an error message.", async () => {
    const deletedDevice = mapDeviceDataToDeviceModel(testDevices[0]);
    const req = { params: { id: deletedDevice.id } } as Partial<Request>;

    jest
      .mocked(prismaClient.device.delete)
      .mockRejectedValue(new Error("Error message."));
    await deleteDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Device with ID ${deletedDevice.id} could not be deleted. Error message.`,
      data: null,
    });
  });
});
