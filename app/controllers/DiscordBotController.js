const DiscordBotStore = require('../models/DiscordBotStore');
const { cacheTime, authToken: serverAuthToken } = require('../../config');
const { clearCache } = require('../setup/cache');

const getStore = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  try {
    return DiscordBotStore.findOne({})
      .select({ store: 1 })
      .lean()
      .cache(cacheTime, 'DiscordBotStore')
      .then((data) => {
        if (data) return res.status(200).json({ store: data.store });
        return res.status(404).json({ error: 'cannot find store in database' });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

const setStore = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { store } = req.body || {};
  const existsStore = await DiscordBotStore.findOne({});

  await clearCache('DiscordBotStore');

  if (existsStore) {
    try {
      await existsStore.updateOne({ store });
      return res.status(200).json({ message: 'success' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'some error was occurred' });
    }
  }

  // if not exists
  const newStore = new DiscordBotStore({ store });
  await newStore.save();

  return res.status(201).json(newStore);
};

module.exports = {
  getStore,
  setStore,
};
