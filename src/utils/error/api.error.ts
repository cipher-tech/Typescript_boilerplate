import { NextFunction, Request, Response } from "express";
import {
    StatusCodes,
    getReasonPhrase
} from "http-status-codes";
import { ZodError } from "zod";

import logger from "../../config/logger"

/**
 * @description Applications Error object class
 * Used to format and return error messages
 *
 * @returns  {object} ApiError class
 */
export class ApiError extends Error {
    private readonly code: number
    private readonly details: number
    constructor(code: number, message: string, details?: any) {
        super(message);
        // const stack = Error.captureStackTrace(this, this.constructor);
        this.code = code;
        this.details = details;
    }

    /**
     * Method to handle intentionally thrown exceptions.
     * @param {object} err express error object
     * @param {object} req express request object
     * @param {object} res express response object
     * @param {function} next express middleware next object
     */
    static appError(err: any, req: Request, res: Response, next: NextFunction) {
        let { code } = err;
        if (err instanceof ZodError) {
            const { message } = err;
            const status = 400;
            code = 400;
            logger.error(`
                Zod validation error error:
                status - ${ status }
                message - ${ message } 
                url - ${ req.originalUrl } 
                method - ${ req.method } 
                IP - ${ req.ip }
                Error Stack - ${ err.stack }
          `);

            return res.status(code || StatusCodes.FORBIDDEN)
                .json({
                    message,
                    status: code,
                    url: req.originalUrl,
                    type: getReasonPhrase(code || StatusCodes.FORBIDDEN)
                });
        }
        else if (code && typeof code === "number") {
            logger.error(`
            API error:
            status - ${ code }
            message - ${ err.message } 
            url - ${ req.originalUrl } 
            method - ${ req.method } 
            IP - ${ req.ip }
            Error Stack - ${ err.stack }
          `);

            return res.status(err.status || 500)
                .json({
                    message: err.message,
                    status: code,
                    url: req.originalUrl,
                    type: getReasonPhrase(code || 500)
                });
            // check if error is from Zod validator package
        } else {
            next(err);
        }
    }

    /**
     * Generic error response handler of internal and unhandled exceptions.
     *
     * @param  {Object}   err
     * @param  {Object}   req
     * @param  {Object}   res
     * @param  {Function} next
     */
    static genericError = (err: any, req: Request, res: Response, next: NextFunction) => {
        const message = "An error occurred, we are looking into it.";
        const status = StatusCodes.INTERNAL_SERVER_ERROR;
        const url = req.originalUrl;

        logger.error(`
        Generic error:
        status - ${ status }
        message - ${ message } 
        url - ${ url } 
        method - ${ req.method } 
        IP - ${ req.ip }
        Error Stack - ${ err.stack }
      `);

        res.status(err.status || 500)
            .json({
                message,
                status,
                url,
                type: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            });
    }
}
