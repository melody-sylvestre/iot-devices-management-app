import type { Request, Response } from "express";

export const registerDevice = async (request: Request, response: Response) => {
  const newDevice = request.body;

  // read JSON body of request
  // validate body against zod schema
  // (validate unique name?) - should be done by Prisma
  // transaction with:
  //    create record in devices - get id
  //    create record in matching table
  // return new record
};
