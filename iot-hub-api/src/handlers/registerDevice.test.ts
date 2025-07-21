//TODELETE:
test("fake test", () => {});

// import { newTestDevice } from "../testUtils/devices";
// import { registerDevice } from "./registerDevice";
// import type { Request, Response } from "express";
// import { validateAndParseNewDevice } from "../validators";

// jest.mock("../validators", () => {
//   return {
//     validateAndParseNewDevice: jest.fn(),
//   };
// });

// describe("registerDevice", () => {
//   let res: Partial<Response>;

//   beforeEach(() => {
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };
//   });

//   test("It returns a 201 status and the new record in the JSON response if the request is valid", async () => {});

//   test("It returns 400 status if the request body has an incorrect format", async () => {
//     const req = {
//       body: {
//         name: "New Device",
//         type: "random",
//         is_enabled: true,
//       },
//     };

//     (validateAndParseNewDevice as jest.Mock).mockImplementation(() => {
//       throw new Error("type: unknown type");
//     });

//     await registerDevice(req as Request, res as Response);

//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.json).toHaveBeenCalledWith({
//       message: "type: unknown type",
//       data: null,
//     });
//   });
//   test("It returns 400 status if there is already a record with the same name", async () => {});

//   test("It returns 500 if the new record can't be created in the device table and the table matching the type of the object", () => {});
// });
