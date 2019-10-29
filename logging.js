const bunyan = require('bunyan');

function getStreams() {
  const streams = [{ stream: process.stdout, level: 'info' }];
  return streams;
}

const logger = bunyan.createLogger({
  name: 'coremote',
  streams: getStreams(),
});

module.exports = {
  logger,
};
