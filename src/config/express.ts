import express, { Express, Request, Response } from 'express';
import { AppEnv } from '../utils/enums';
import Env from '../utils/env';
import Swagger from '../config/swagger';
import Router from "../routes"

export default function App(): Express {
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

    
    console.log("Hello World!",);
    
    app.disable('x-powered-by');
    app.use("/api/v1", Router);
    app.get('/', (req: Request, res: Response) => {
        res.send('Express + TypeScript Server');
    });
    
    return app;
  }