const path = require('path');

const express = require('express');
const expressNunjucks = require('express-nunjucks');

const { logger } = require('./logging');

const app = express();

const isDev = app.get('env') === 'development' || app.get('env') === 'test';

app.set('views', `${__dirname}/templates`);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());

expressNunjucks(app, {
  watch: isDev,
  noCache: isDev,
});

app.get('/', (req, res) => {
  res.render('index');
});

const port = process.env.PORT || 14000;
const server = app.listen(port);

const timeout = process.env.REQUEST_TIMEOUT_MS || 1000;
server.setTimeout(timeout);
logger.info(`Setting request timeout: ${timeout} ms`);

logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`Listening on port ${port}`);

if (!isDev) {
  const gracefulShutdown = function gracefulShutdown() {
    logger.info('Received kill signal, shutting down gracefully.');
    server.close(() => {
      logger.info('Closed out remaining connections.');
      process.exit();
    });

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit();
    }, 10 * 1000);
  };

  // listen for TERM signal .e.g. kill
  process.on('SIGTERM', gracefulShutdown);

  // listen for INT signal e.g. Ctrl-C
  process.on('SIGINT', gracefulShutdown);
}

module.exports = app;
