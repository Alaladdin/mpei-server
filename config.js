require('dotenv').config();
const ms = require('ms');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  isProd,
  authToken: process.env.AUTH_TOKEN,
  youtubeApi: process.env.YOUTUBE_API,
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  cacheTime: process.env.CACHE_TIME || ms('1h'),
  maxRequests: isProd ? 100 : 0,
  apiPrefix: process.env.API_PREFIX || '',
  redisHost: isProd ? process.env.REDIS_HOST : 'localhost',
  redisPort: isProd ? process.env.REDIS_PORT : 6379,
  redisPass: process.env.REDIS_PASS,
  getMpeiScheduleUrl(start, finish, group = process.env.GROUP) {
    const url = new URL(`http://ts.mpei.ru/api/schedule/group/${group}`);

    if (start) url.searchParams.append('start', start);
    if (finish) url.searchParams.append('finish', finish);

    return url.href;
  },
};
