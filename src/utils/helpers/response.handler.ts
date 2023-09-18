import { Request, Response as expressResponse } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import Env from "../env";
import {IResponseType} from "../../types"

/**
 * Applications response handler class
 * Handles both success and error responses using well defined methods
 * @param {object} req express request object
 * @param {object} res express response object
 *
 * @returns {object} response
 */
class ResponseHandler {
    private readonly domain: string
    private readonly environment: string
    private readonly request: Request
    private readonly response: expressResponse
    constructor(req: Request, res: expressResponse) {
        this.domain = Env.get('DOMAIN');
        this.environment = Env.get('ENVIRONMENT');
        this.request = req;
        this.response = res;
    }

    /**
     * Method to Handles success responses to ensure consistency
     * @param {object} options - {message, data}
     *
     * @returns {object} - success response
     */
    success(options: IResponseType) {
        // if (!options || Object.entries(options).length === 0) {
        //     logger.error("options object required in app/utils/responseHandler.js");
        //     return new Error("Error: Arguments to the success response handler cannot be empty");
        // }

        const { message, data, code = StatusCodes.OK } = options;
        const currentUrl = `${ this.domain }${ this.request.originalUrl }`;

        const response = {
            url: currentUrl,
	        status: "success",
            message,
            data,
            type: getReasonPhrase(code)

        };

        return this.response.status(code).json(response);
    }
}

export const Response = ResponseHandler;
