import { Response, Request } from "express";
import { updateDevice } from "./updateDevice";
import { prismaClient } from "../prisma/client";
import { mapDeviceDataToDeviceModel } from "../formatters";
import { v4 } from "uuid";
import { testDevices } from "../testUtils/devices";
jest.mock("../prisma/client");

describe("updateDevice", () => {
  let res: Partial<Response>;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  //TODO: add a test for if the update fails because it is not possible to fetch the initial record.

  test("If the data for the update cannot be parsed because of an invalid type, it returns a 400 status and a JSON object containing an error message.", async () => {
    const req = {
      body: {
        type: "random",
      },
    };

    await updateDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error: random is not a supported device type.",
      data: null,
    });
  });

  test("If the update data is invalid (e.g trying to updated a target temperature for a light switch), it returns a 400 status and a JSON object containing an error message.", async () => {
    const existingRecord = mapDeviceDataToDeviceModel({
      id: v4(),
      name: "Kitchen Light",
      type: "Light Switch",
      is_enabled: true,
      is_on: false,
    });
    const req = {
      body: {
        target_value: 18,
      },
    };

    //TODO: add mock to getDevice here!
    await updateDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: invalid update for this type of device (${existingRecord.type})`,
      data: null,
    });
  });

  test("If the update is successful, it returns a 200 status and a JSON object containing a success message and the update database record", async () => {
    const existingRecord = mapDeviceDataToDeviceModel({
      id: v4(),
      name: "Kitchen Light",
      type: "Light Switch",
      is_enabled: true,
      is_on: false,
    });
    const updateData = {
      name: "new name",
      is_on: true,
    };

    const updatedRecord = {
      ...existingRecord,
      ...updateData,
    };

    const req = { body: updateData };

    jest.mocked(prismaClient.device.update).mockResolvedValue(updatedRecord);
    await updateDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Successfully updated device ${updatedRecord.name} (id ${updatedRecord.id})`,
      data: updatedRecord,
    });
  });

  test("If the update is unsuccessful because of a database error, it returns a 500 status and a JSON object containing an error message", async () => {
    const existingRecord = mapDeviceDataToDeviceModel(testDevices[0]);
    const updateData = {
      name: "new name",
    };

    const req = { body: updateData };

    jest
      .mocked(prismaClient.device.update)
      .mockRejectedValue(new Error("Error message."));
    await updateDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Could not update device ${existingRecord.name} (id ${existingRecord.id}). Error message.`,
      data: null,
    });
  });
});
