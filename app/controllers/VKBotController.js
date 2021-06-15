const VKBotStore = require('../models/VKBotStore');
const { cacheTime, authToken: serverAuthToken } = require('../../config');
const { clearCache } = require('../setup/cache');

const getStore = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  try {
    return VKBotStore.findOne({})
      .select({ store: 1 })
      .lean()
      .cache(cacheTime, 'VKBotStore')
      .then((data) => {
        if (data) return res.status(200).json({ store: data.store });
        return res.status(404).json({ message: 'cannot find store in database' });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error was occurred' });
  }
};

const setStore = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { store } = req.body || {};
  const existsStore = await VKBotStore.findOne({});

  await clearCache('VKBotStore');

  if (existsStore) {
    try {
      await existsStore.updateOne({ store });
      return res.status(200).json({ message: 'success' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'some error was occurred' });
    }
  }

  // if not exists
  const newStore = new VKBotStore({ store });
  await newStore.save();

  return res.status(201).json(newStore);
};

module.exports = {
  getStore,
  setStore,
};
