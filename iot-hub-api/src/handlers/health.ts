import type { Response, Request } from "express"

export const healthCheck = (request: Request, response: Response) => {
    response.status(200).json({message: "OK", data: null})
}