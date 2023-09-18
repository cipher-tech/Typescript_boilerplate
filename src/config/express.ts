import express, { Express, Request, Response } from 'express';
import { AppEnv } from '../utils/enums';
import Env from '../utils/env';
import Swagger from '../config/swagger';
import { Router } from "../routes"
import { ApiError } from "../utils/error"

export default function App(): Express {
  // const apiError = new ApiError()
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const SWAGGER_ROUTE = Env.get<string>('SWAGGER_ROUTE');
  const NODE_ENV = Env.get<string>('NODE_ENV');

  Swagger(app, {
    swaggerDocRoute: SWAGGER_ROUTE || "/swagger",
    definitionsPath: [
      NODE_ENV == AppEnv.DEVELOPMENT ? './**/*.ts' : './**/*.js',
    ],
    explorer: true,
  });


  console.log("Swagger Server!",);
  app.disable('x-powered-by');
  app.use("/api/v1", Router);
  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });
  // Handles exceptions thrown in the application
  app.use(ApiError.appError);

  // handle all error instances and returns an errors response
  // eslint-disable-next-line no-unused-vars
  app.use(ApiError.genericError);

  return app;
}