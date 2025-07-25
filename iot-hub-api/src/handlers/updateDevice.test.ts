import { Response, Request } from "express";
import { updateDevice } from "./updateDevice";
import { prismaClient } from "../prisma/client";
import { validateAndMapNewDataToDeviceModel } from "../validators";
import { v4 } from "uuid";
import { testDevices } from "../testUtils/devices";
import { defaultDevice } from "../definitions/constants";
import { Prisma } from "@prisma/client";

jest.mock("../prisma/client");

describe("updateDevice", () => {
  let res: Partial<Response>;
  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("If the database record does not exist, it returns a status 404 and a JSON object with an error message", async () => {
    const id = v4();
    const req = { params: { id } } as Partial<Request>;

    jest.mocked(prismaClient.device.findUnique).mockResolvedValue(null);
    await updateDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: there is no device with id ${id} in the database.`,
      data: null,
    });
  });

  test("If it is not possible to fetch the existing record from the database for another reason, it returns a status 500 and a JSON object with an error message", async () => {
    const id = v4();
    const req = { params: { id } } as Partial<Request>;

    jest
      .mocked(prismaClient.device.findUnique)
      .mockRejectedValue(new Error("Database error."));
    await updateDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: impossible to fetch device id ${id} from database. Database error.`,
      data: null,
    });
  });

  test("If the data for the update cannot be parsed because of an invalid type, it returns a 400 status and a JSON object containing an error message.", async () => {
    const id = v4();
    const existingRecord = { ...defaultDevice, ...testDevices[0], id: id };
    const req = {
      body: {
        type: "random",
      },
      params: { id },
    } as Partial<Request>;

    jest
      .mocked(prismaClient.device.findUnique)
      .mockResolvedValue(existingRecord);

    await updateDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Error: invalid update request. Error: random is not a supported device type.",
      data: null,
    });
  });

  test("If the update data is invalid (e.g trying to update a target temperature for a light switch), it returns a 400 status and a JSON object containing an error message.", async () => {
    const existingRecord = validateAndMapNewDataToDeviceModel({
      id: v4(),
      name: "Kitchen Light",
      type: "Light Switch",
      is_enabled: true,
      is_on: false,
    });
    const req = {
      body: {
        target_value_1: 18,
      },
      params: { id: existingRecord.id },
    } as Partial<Request>;

    jest
      .mocked(prismaClient.device.findUnique)
      .mockResolvedValue(existingRecord);

    await updateDevice(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Error: invalid update request. ✖ Invalid input: expected null, received number\n  → at target_value_1",
      data: null,
    });
  });

  test("If the device was not updated because there is already another device with the same name in the database, it returns a 400 status and JSON object with an error message.", async () => {
    const existingRecord = validateAndMapNewDataToDeviceModel({
      id: v4(),
      name: "Kitchen Light",
      type: "Light Switch",
      is_enabled: true,
      is_on: false,
    });

    const updateData = {
      name: "device name",
      is_on: true,
    };

    const proposedUpdate = {
      ...existingRecord,
      ...updateData,
    };

    const req = {
      body: updateData,
      params: { id: existingRecord.id },
    } as Partial<Request>;

    jest
      .mocked(prismaClient.device.findUnique)
      .mockResolvedValue(existingRecord);
    jest.mocked(prismaClient.device.update).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Duplicate name", {
        code: "P2002",
        clientVersion: "6.12.0",
      })
    );
    await updateDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: the name ${proposedUpdate.name} or the id ${proposedUpdate.id} is already present in the database and cannot be duplicated.`,
      data: null,
    });
  });

  test("If the update is successful, it returns a 200 status and a JSON object containing a success message and the update database record", async () => {
    const existingRecord = validateAndMapNewDataToDeviceModel({
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

    const req = {
      body: updateData,
      params: { id: existingRecord.id },
    } as Partial<Request>;

    jest
      .mocked(prismaClient.device.findUnique)
      .mockResolvedValue(existingRecord);
    jest.mocked(prismaClient.device.update).mockResolvedValue(updatedRecord);
    await updateDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: `Successfully updated device ${updatedRecord.name} (id ${updatedRecord.id}).`,
      data: updatedRecord,
    });
  });

  test("If the update is unsuccessful because of a database error, it returns a 500 status and a JSON object containing an error message", async () => {
    const existingRecord = validateAndMapNewDataToDeviceModel(testDevices[0]);
    const updateData = {
      name: "new name",
    };

    const req = {
      body: updateData,
      params: { id: existingRecord.id },
    } as Partial<Request>;

    jest
      .mocked(prismaClient.device.findUnique)
      .mockResolvedValue(existingRecord);

    jest
      .mocked(prismaClient.device.update)
      .mockRejectedValue(new Error("Error message."));
    await updateDevice(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: `Error: could not update device ${existingRecord.name} (id ${existingRecord.id}). Error message.`,
      data: null,
    });
  });
});
