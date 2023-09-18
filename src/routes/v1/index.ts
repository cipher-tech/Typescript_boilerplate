import express from "express";
import { authRouter } from "../../modules/auth/auth.route";

const appRouter = express.Router()

appRouter.use("/auth", authRouter)

export const Router = appRouter