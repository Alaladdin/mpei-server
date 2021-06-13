require('dotenv').config();
const app = require('./app/setup/express');
const mongoose = require('./app/setup/mongoose');
const { port, host, mongoUri } = require('./config');

try {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.info('connected to mongo database');
} catch (err) {
  console.error(err);
}

app.listen(port, host, () => console.info(`listening on port ${port}`));
