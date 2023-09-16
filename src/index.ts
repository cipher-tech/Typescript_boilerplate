import http from 'http';
import { Express } from 'express';
import "dotenv/config";

import { envValidatorSchema } from './utils/validators';
import Env from './utils/env';
import Logger from './config/logger';
// import { connectDB } from './config/database';
import App from './config/express';
import { AppEnv } from './utils/enums';

async function main(App: (...args: any[]) => Express) {

    // run the following three before initializing App function
    await Env.validateEnv(envValidatorSchema);

    const logger = new Logger();
    // global.logger = logger;
    const app = App();
    
    const PORT = Env.get<number>('PORT') || 8080;
    const NODE_ENV = Env.get<string>('NODE_ENV');
    logger.info(`Server started on port ${PORT} ....`)

    NODE_ENV !== AppEnv.PRODUCTION &&
        app.listen(PORT, () => {
            const NODE_ENV = Env.get<string>('NODE_ENV');
            NODE_ENV !== AppEnv.PRODUCTION && console.log(`[server]: Server is running at http://localhost:${ PORT }`);
        });
}
main(App);
