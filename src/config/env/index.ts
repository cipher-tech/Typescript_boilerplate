import path from 'path';
import development from './development';
import test from './test';

const defaults = {
  ROOT: path.normalize(`${__dirname}/..`),
  SERVICE_NAME: "Roigour_OS_API"
};

export default {
  development: Object.assign(defaults, development),
  test: Object.assign(defaults, test)
}[process.env._NODE_ENV || 'development'];
