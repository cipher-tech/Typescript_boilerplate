import express from "express";
import { authRouter } from "../modules/auth/auth.route";

const Router = express.Router()

Router.use("/auth", authRouter)
export default Router