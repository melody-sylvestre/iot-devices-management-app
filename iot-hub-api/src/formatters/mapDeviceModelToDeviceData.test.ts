import { defaultDevice } from "../definitions/constants";
import { v4 } from "uuid";
import { mapDeviceModelToDeviceData } from "./mapDeviceModelToDeviceData";

describe("mapDeviceModelToDeviceData", () => {
  test("It throws an error if the device type was not added to the DEVICE_VALIDATION RULES", () => {
    const dbRecord = { ...defaultDevice, type: "weird device" };

    expect(() => {
      mapDeviceModelToDeviceData(dbRecord);
    }).toThrow("Error: weird device is not a supported device type.");
  });

  test("It throws an error if the record could not be parsed following the DEVICE_VALIDATION RULES", () => {
    const dbRecord = { ...defaultDevice, type: "Thermostat" };

    expect(() => {
      mapDeviceModelToDeviceData(dbRecord);
    }).toThrow(
      "Error: could not parse the data following the Thermostat schema; id: Invalid UUID ; name: Too small: expected string to have >=1 characters ; current_value_1: Invalid input: expected number, received null ; target_value_1: Invalid input: expected number, received null ;"
    );
  });

  test("It returns an object with only the relevant field for that device type when provided with a valid device record.", () => {
    const thermostatData = {
      id: v4(),
      name: "Thermostat Kitchen",
      type: "Thermostat",
      is_enabled: true,
      current_value_1: 15,
      target_value_1: 25,
    };

    const thermostatDbRecord = {
      ...defaultDevice,
      ...thermostatData,
    };

    expect(mapDeviceModelToDeviceData(thermostatDbRecord)).toStrictEqual(
      thermostatData
    );
  });
});
