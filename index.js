require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoose = require('mongoose');

const cors = require('cors');
const route = require('./app/routes/MpeiRoute');
const hosts = require('./hosts');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to mongo database'))
  .catch(console.error);

// eslint-disable-next-line no-console
app.listen(PORT, HOST, () => console.log(`listening on port ${PORT}`));
