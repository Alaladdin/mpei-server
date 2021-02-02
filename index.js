const fs = require('fs');
const dotenv = require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const cors = require('cors');
const route = require('./app/routes/MpeiRoute');

const app = express();
const PORT = process.env.PORT || 3000;
const hosts = JSON.parse(fs.readFileSync('hosts.json'));
const limit = rateLimit({
  max: 100, // max requests
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: 'Too many requests',
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
app.use('', route);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
