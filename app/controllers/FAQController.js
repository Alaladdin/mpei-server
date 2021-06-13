const { cacheTime, authToken: serverAuthToken } = require('../../config');
const FAQ = require('../models/FAQ');
const { CacheService } = require('../cache/CacheService');

const cache = new CacheService(cacheTime);

const getFAQ = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  try {
    return cache.get('FAQ', async () => FAQ.findOne({}).select({ faq: 1 }).lean())
      .then((data) => {
        if (data) return res.status(200).json({ faq: data.faq });
        return res.status(404).json({ error: 'cannot find FAQ in database' });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'some error was occurred' });
  }
};

const setFAQ = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { faq } = req.body || {};
  const existsFAQ = await FAQ.findOne({});

  if (existsFAQ) {
    try {
      await existsFAQ.faq.push(faq);
      await existsFAQ.save();

      return res.status(200).json({ message: 'success' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'some error was occurred' });
    }
  }

  // if not exists
  const newFAQ = new FAQ({ faq });
  await newFAQ.save();

  return res.status(201).json(newFAQ);
};

const deleteFAQ = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { question } = req.body || {};
  if (!question) return res.status(401).json({ message: 'no question to delete was provided' });

  const existsFAQ = await FAQ.findOne({});
  if (!existsFAQ) return res.status(404).json({ error: 'cannot find FAQ in database' });

  const itemToDelete = existsFAQ.faq.findIndex((item) => item.question === question);
  if (itemToDelete === -1) return res.status(404).json({ error: 'cannot find that question in database' });

  existsFAQ.faq.splice(itemToDelete, 1);
  await existsFAQ.save();
  return res.status(201).json(existsFAQ);
};

module.exports = {
  getFAQ,
  setFAQ,
  deleteFAQ,
};
