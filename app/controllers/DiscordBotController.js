const DiscordBotConfig = require('../models/DiscordBotConfig');
const { CacheService } = require('../cache/CacheService');
const { cacheTime, authToken: serverAuthToken } = require('../../config');

const cache = new CacheService(cacheTime);

const getConfig = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  try {
    return cache.get('DiscordBotConfig', async () => DiscordBotConfig.findOne({}).select({ config: 1 }).lean())
      .then((data) => {
        if (data) return res.status(200).json({ config: data.config });
        return res.status(404).json({ error: 'cannot find config in database' });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

const setConfig = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { config } = req.body || {};
  const existsConfig = await DiscordBotConfig.findOne({});

  if (existsConfig) {
    try {
      await existsConfig.update({ config });
      return res.status(200).json({ message: 'success' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'some error was occurred' });
    }
  }

  // if not exists
  const newConfig = new DiscordBotConfig({ config });
  await newConfig.save();

  return res.status(201).json(newConfig);
};

module.exports = {
  getConfig,
  setConfig,
};
