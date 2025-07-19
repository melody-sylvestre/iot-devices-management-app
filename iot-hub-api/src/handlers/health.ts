import type { Response, Request } from "express"

//TODELETE:
export const healthCheck = (request: Request, response: Response) => {
    response.status(200).json({message: "OK", data: null})
}