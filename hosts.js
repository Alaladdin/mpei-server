const { isProd } = require('./config');

const allowed = [
  'mpei.space',
  'beta.mpei.space',
];

if (!isProd) allowed.push('localhost:8000', '127.0.0.1:8000', '192.168.1.1:8000');

module.exports = allowed;
