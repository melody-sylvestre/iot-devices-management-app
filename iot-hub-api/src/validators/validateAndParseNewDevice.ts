import { newDeviceSchema } from "../types.ts";

export const validateAndParseNewDevice = (input: any) => {
  const newDeviceRequest = newDeviceSchema.safeParse(input);

  if (!newDeviceRequest.success) {
    let message = "";

    for (const error of newDeviceRequest.error.issues) {
      message += `${error.path}: ${error.message} ; `;
    }

    console.log(message);
    throw new Error(message);
  }

  return newDeviceRequest.data;
};
