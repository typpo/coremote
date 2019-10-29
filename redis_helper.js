const redis = require('redis');

const { logger } = require('./logging');

const redisClient = redis.createClient();

module.exports = {
  redisClient,
};
