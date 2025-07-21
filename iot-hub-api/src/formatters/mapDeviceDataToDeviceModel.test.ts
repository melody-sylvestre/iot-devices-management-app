import type { Device } from "@prisma/client";
import { defaultDevice } from "../definitions/constants";
import { mapDeviceDataToDeviceModel } from "./mapDeviceDataToDeviceModel";

import { v4 } from "uuid";

describe("mapDeviceDataToDeviceModel", () => {
  test("When provided with an object representing a device request, it returns an object of Device type, with the missing properties set to null", () => {
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

    expect(mapDeviceDataToDeviceModel(testDevice)).toStrictEqual(
      testDeviceAsDeviceModel
    );
  });

  test("If a required property is missing from the device request, it throws an error", () => {
    const badDevice = { name: "badDevice" };

    expect(() => {
      mapDeviceDataToDeviceModel(badDevice);
    }).toThrow(
      '✖ Invalid input: expected string, received undefined\n  → at id\n✖ Invalid option: expected one of "Thermostat"|"Light Switch"\n  → at type\n✖ Invalid input: expected boolean, received undefined\n  → at is_enabled'
    );
  });
});
