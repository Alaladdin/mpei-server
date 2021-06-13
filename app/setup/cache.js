const mongoose = require('mongoose');
const cachegoose = require('cachegoose');
const { redisHost, redisPort, redisPass } = require('../../config');

const redisConfig = {
  engine: 'redis',
  host: redisHost,
  port: redisPort,
};

if (redisPass) redisConfig.password = redisPass;

cachegoose(mongoose, redisConfig);

const clearCache = async (key, cb) => {
  if (!key) return console.error('[REDIS] key not provided to clear cache');
  return cachegoose.clearCache(key, cb);
};

module.exports = {
  clearCache,
};
