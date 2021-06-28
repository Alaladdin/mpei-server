require('dotenv').config();

const params = process.argv.slice(2); // cli params
const isProd = process.env.NODE_ENV === 'production';
const isMongoDev = !isProd && params.includes('--mongo-dev');

module.exports = {
  isProd,
  authToken: process.env.AUTH_TOKEN,
  youtubeApi: process.env.YOUTUBE_API,
  mongoUri: !isMongoDev ? process.env.MONGO_URI : process.env.MONGO_URI_DEV,
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  cacheTime: process.env.CACHE_TIME || 86400,
  maxRequests: isProd ? 200 : 0,
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
