/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');

const env = dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

module.exports = env.parsed;
