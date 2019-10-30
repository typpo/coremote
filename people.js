const crypto = require('crypto');

const { logger } = require('./logging');
const { redisClient } = require('./redis_helper');

const ACTIVITY_EXPIRATION_MS = 3 * 60 * 1000;

function getActivePeople() {
  return new Promise((resolve, reject) => {
    redisClient.zrevrangebyscore(
      'active',
      Number.POSITIVE_INFINITY,
      new Date().getTime() - ACTIVITY_EXPIRATION_MS,
      (err, members) => {
        if (err) {
          reject(err);
        } else if (members.length < 1) {
          // Add a placeholder person or people, otherwise frontend will choke.
          resolve({
            id: 1,
            image: '',
            status: '',
            mood: '',
          });
        } else {
          const promise = Promise.all(
            members.map(async id => {
              const image = await getImage(id);
              const status = await getStatus(id);
              const mood = await getMood(id);
              return {
                id: crypto
                  .createHash('sha256')
                  .update(id)
                  .digest('hex'),
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
