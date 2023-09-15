import express from "express";
import { AuthController } from "./auth.controller";

const Router = express.Router()

Router.post("/login", new AuthController().login)

export const authRouter = Router