import development from './development';
import test from './test';

export default {
  development,
  test,
}[process.env._NODE_ENV || 'development'];
