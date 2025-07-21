//TODELETE:

test("fake test", () => {});
// import { validateAndParseNewDevice } from "./validateAndParseNewDevice";
// import { newTestDevice } from "../testUtils/devices";

// describe("validateAndParseNewDevice", () => {
//   test("if the input as the correct format, it returns a DeviceRequestObject", () => {
//     expect(validateAndParseNewDevice(newTestDevice)).toStrictEqual(
//       newTestDevice
//     );
//   });

//   test("if the input is an empty object, it throws an error because fields are missing", () => {
//     expect(() => {
//       validateAndParseNewDevice({});
//     }).toThrow(
//       'name: Invalid input: expected string, received undefined ; type: Invalid option: expected one of "Thermostat"|"Light Switch" ; is_enabled: Invalid input: expected boolean, received undefined ; '
//     );
//   });

//   test("if one or several input fields have an incorrect format, it throws an error describing all the issues with the input", () => {
//     const input = {
//       name: "",
//       type: "radio",
//       bad_key: true,
//     };
//     expect(() => {
//       validateAndParseNewDevice(input);
//     }).toThrow(
//       'name: Too small: expected string to have >=1 characters ; type: Invalid option: expected one of "Thermostat"|"Light Switch" ; is_enabled: Invalid input: expected boolean, received undefined ; : Unrecognized key: "bad_key"'
//     );
//   });
// });
