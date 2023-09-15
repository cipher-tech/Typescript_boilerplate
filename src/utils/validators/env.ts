import {z} from 'zod';
import { AppEnv } from '../enums';

export interface EnvProps {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
}

export const envValidatorSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.string() 
    // .valid(AppEnv.DEVELOPMENT, AppEnv.TEST, AppEnv.STAGING, AppEnv.PRODUCTION)
    .default(AppEnv.DEVELOPMENT),

  DATABASE_URL: z.string()

})
// .unknown(true);
