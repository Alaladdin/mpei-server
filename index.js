require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./app/routes/MpeiRoute');
const hosts = require('./hosts');
const {
  isProd,
  port,
  host,
  mongoUri,
  maxRequests,
} = require('./config');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const app = express();

const limit = rateLimit({
  max: maxRequests,
  windowMs: 60 * 60 * 1000, // 1 Hour
  handler(req, res) {
    return res.status(429).json({ message: 'Too many requests' });
  },
});

app.use(limit);
app.use(helmet());
app.use(xss());
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const url = new URL(origin);

    if (hosts.allowed.indexOf(url.host) === -1) {
      const msg = '😞 no CORS, no party!';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));
app.use(express.json({ limit: '5kb' })); // Body limit
app.use(expressWinston.logger({
  meta: true,
  expressFormat: true,
  statusLevels: true,
  transports: [
    new winston.transports.File({
      filename: `logs/${isProd ? 'all' : 'debug'}.json`,
      level: isProd ? 'info' : 'debug',
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: 'logs/errors.json',
      level: 'error',
      format: winston.format.json(),
    }),
  ],
}));
app.use('', route);

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.info('connected to mongo database'))
  .catch(console.error);

app.listen(port, host, () => console.info(`listening on port ${port}`));
