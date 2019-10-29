const { logger } = require('./logging');
const { redisClient } = require('./redis_helper');

function getActivePeople() {
  return new Promise((resolve, reject) => {
    redisClient.zrevrangebyscore(
      'active',
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      (err, members) => {
        if (err) {
          reject(err);
        } else {
          const promise = Promise.all(
            members.map(async id => {
              const image = await getImage(id);
              const status = await getStatus(id);
              const mood = await getMood(id);
              return {
                image,
                status,
                mood,
              };
            }),
          );
          promise.then(results => {
            resolve(results);
          });
        }
      },
    );
  });
}

function setImage(id, imageData) {
  redisClient.set(`image:${id}`, imageData);
  // https://redis.io/commands/zadd
  logger.info({ id, imageLength: imageData.length }, `Setting image for ${id}`);
  redisClient.zadd('active', new Date().getTime(), id);
}

function getImage(id) {
  return get('image', id);
}

function setStatus(id, val) {
  logger.info({ id, status: val }, `Setting status ${val} for ${id}`);
  redisClient.set(`status:${id}`, val);
}

function getStatus(id) {
  return get('status', id);
}

function setMood(id, val) {
  redisClient.set(`mood:${id}`, val);
}

function getMood(id) {
  return get('mood', id);
}

function get(type, id) {
  return new Promise((resolve, reject) => {
    redisClient.get(`${type}:${id}`, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = {
  getStatus,
  getMood,
  getImage,
  setStatus,
  setMood,
  setImage,
  getActivePeople,
};
