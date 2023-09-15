import { configDotenv } from 'dotenv';
import { z } from 'zod';
import config from '../config/env';

configDotenv();

export default class Env {
  private static validatedEnv: any;

  public static async validateEnv<T>(validationSchema: z.Schema<T>) {
    try {
      
      this.validatedEnv = await validationSchema.parseAsync(config);
    } catch (e) {
      throw e;
    }
  }

  public static get<T = string>(key: string) {
    if (this.validatedEnv?.[key] != null) return this.validatedEnv[key] as T;
    return (config as any)[key] as T;
  }
}
