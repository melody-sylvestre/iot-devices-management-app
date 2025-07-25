import type { Device } from "@prisma/client";
import { defaultDevice } from "../definitions/constants";
import { validateAndMapNewDataToDeviceModel } from "./validateAndMapNewDataToDeviceModel";

import { v4 } from "uuid";

describe("validateAndMapNewDataToDeviceModel", () => {
  test("When provided with an object representing a device data, it returns an object of Device type, with the missing properties set to null or empty strings", () => {
    const testDevice = {
      id: v4(),
      name: "Kitchen Light",
      type: "Light Switch",
      is_enabled: true,
      is_on: true,
    };
    const testDeviceAsDeviceModel: Device = {
      ...defaultDevice,
      ...testDevice,
    };

    expect(validateAndMapNewDataToDeviceModel(testDevice)).toStrictEqual(
      testDeviceAsDeviceModel
    );
  });

  test("If the object does not have the property type, or if this type is not supported, it throws an error", () => {
    const badDevice = { name: "Weird Device", type: "UFO" };

    expect(() => {
      validateAndMapNewDataToDeviceModel(badDevice);
    }).toThrow(`Error: UFO is not a supported device type.`);
  });

  test("If a required property is missing from the device request, it throws an error", () => {
    const badDevice = {
      name: "badDevice",
      type: "Light Switch",
    };

    expect(() => {
      validateAndMapNewDataToDeviceModel(badDevice);
    }).toThrow(
      "✖ Invalid input: expected boolean, received undefined\n  → at is_enabled\n✖ Invalid input: expected boolean, received undefined\n  → at is_on"
    );
  });

  test("If a field not supported for that type of device, it throws an error", () => {
    const badDevice = {
      id: v4(),
      name: "Kitchen Light",
      type: "Light Switch",
      is_enabled: true,
      is_on: true,
      current_value_1: 1,
    };

    expect(() => {
      validateAndMapNewDataToDeviceModel(badDevice);
    }).toThrow(
      new Error(
        "✖ Invalid input: expected null, received number\n  → at current_value_1"
      )
    );
  });
});
