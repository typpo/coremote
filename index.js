const path = require('path');

const express = require('express');
const expressNunjucks = require('express-nunjucks');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);

const db = require('./people');
const { logger } = require('./logging');
const { redisClient } = require('./redis_helper');

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

app.use(
  expressSession({
    store: new RedisStore({ client: redisClient }),
    secret: 'swiggity swoogity',
    cookie: {
      secure: !isDev,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }),
);

app.get('/', async (req, res) => {
  const status = await db.getStatus(req.session.id);
  const mood = await db.getMood(req.session.id);
  res.render('index', {
    status,
    mood,
  });
});

app.post('/api/image', (req, res) => {
  const uid = req.session.id;
  const img = req.body.val;
  logger.info('Got image of length', img.length);
  if (img) {
    db.setImage(req.session.id, img);
  }
  res.send('');
});

app.post('/api/status', (req, res) => {
  const uid = req.session.id;
  const status = req.body.val.trim();
  if (status) {
    db.setStatus(req.session.id, status);
  }
  res.send('');
});

app.post('/api/mood', (req, res) => {
  const uid = req.session.id;
  const mood = req.body.val.trim();
  if (mood) {
    db.setMood(req.session.id, mood);
  }
  res.send('');
});

app.get('/api/people', async (req, res) => {
  const people = await db.getActivePeople(req.session.id);
  res.send({
    people,
  });
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
