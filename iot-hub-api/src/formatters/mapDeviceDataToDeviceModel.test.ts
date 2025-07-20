import type { Device } from "@prisma/client";
import { defaultDevice } from "../definitions/constants";
import { mapDeviceDataToDeviceModel } from "./mapDeviceDataToDeviceModel";

import { v4 } from "uuid";

describe("deviceRequestToDeviceType", () => {
  test("When provided with an object representing a device request, it returns an object of Device type, with the missing properties set to null", () => {
    const testDevice = {
      id: v4(),
      name: "Kitchen Light",
      type: "Light Switch",
      is_enabled: true,
      is_on: true,
    };
    const testDeviceAsDeviceType: Device = {
      ...defaultDevice,
      ...testDevice,
    };

    expect(mapDeviceDataToDeviceModel(testDevice)).toStrictEqual(
      testDeviceAsDeviceType
    );
  });

  test("If a required property is missing from the device request, it throws an error", () => {
    const badDevice = { name: "badDevice" };

    expect(() => {
      mapDeviceDataToDeviceModel(badDevice);
    }).toThrow(
      'id: Invalid input: expected string, received undefined ; type: Invalid option: expected one of "Thermostat"|"Light Switch" ; is_enabled: Invalid input: expected boolean, received undefined ;'
    );
  });
});
