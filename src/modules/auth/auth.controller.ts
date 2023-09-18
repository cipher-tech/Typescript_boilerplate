import { Request, Response } from "express"
import z from "zod"

import { ApiError } from "../../utils/error"
import { StatusCodes } from "http-status-codes"
import {ResponseHandler} from "../../utils/helpers"
export class AuthController {
    login = (req: Request, res: Response) => {
        const response = new ResponseHandler(req, res)

        return response.success({
            message: "Logged in successfully",
            code: StatusCodes.OK,
            data: []
        })
        // return res.json("okay")
    }
}