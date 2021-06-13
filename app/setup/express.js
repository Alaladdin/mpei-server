const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const cors = require('cors');
const route = require('../routes/MpeiRoute');
const hosts = require('../../hosts');
const { isProd, maxRequests } = require('../../config');

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
app.use(express.json({ limit: '5kb' })); // Body limit
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const url = new URL(origin);

    if (!hosts.allowed.includes(url.host)) {
      const msg = '😞 no CORS, no party!';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));
app.use(expressWinston.logger({
  meta: true,
  expressFormat: true,
  statusLevels: true,
  transports: [
    new winston.transports.File({
      filename: `../../logs/${isProd ? 'all' : 'debug'}.json`,
      level: isProd ? 'info' : 'debug',
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: '../../logs/errors.json',
      level: 'error',
      format: winston.format.json(),
    }),
  ],
}));
app.use('', route);
module.exports = app;
