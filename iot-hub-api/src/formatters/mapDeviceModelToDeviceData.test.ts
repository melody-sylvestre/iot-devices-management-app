import { defaultDevice } from "../definitions/constants";
import { v4 } from "uuid";
import { mapDeviceModelToDeviceData } from "./mapDeviceModelToDeviceData";

describe("mapDeviceModelToDeviceData", () => {
  test("Returns an object with only the relevant field for that device type", () => {
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

  // TODO: add test to check that it throws an error if the conversion fails
});
