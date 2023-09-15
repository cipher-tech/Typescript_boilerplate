import { configDotenv } from 'dotenv';
configDotenv();

const test = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST,
  PAPERTRAIL_URL: process.env.PAPERTRAIL_URL,
};

export default test;
