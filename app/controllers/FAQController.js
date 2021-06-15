const FAQ = require('../models/FAQ');
const { cacheTime, authToken: serverAuthToken } = require('../../config');
const { clearCache } = require('../setup/cache');

const getFAQ = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  try {
    return FAQ.findOne({})
      .select({ faq: 1 })
      .lean()
      .cache(cacheTime, 'FAQ')
      .then((data) => {
        if (data) return res.status(200).json({ faq: data.faq });
        return res.status(404).json({ message: 'cannot find FAQ in database' });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'some error was occurred' });
  }
};

const addFAQ = async (req, res) => {
  const { authToken } = req.query;

  if (!authToken) return res.status(403).json({ message: 'no auth token was provided' });
  if (authToken !== serverAuthToken) return res.status(403).json({ message: 'incorrect auth token' });

  const { faq } = req.body || {};
  const existsFAQ = await FAQ.findOne({});

  await clearCache('FAQ');

  if (existsFAQ) {
    const existsQuestion = existsFAQ.faq.find((faqItem) => faqItem.question === faq.question);
    if (existsQuestion) return res.status(400).json({ message: 'question already exists' });

    try {
      await existsFAQ.faq.push(faq);
      await existsFAQ.save();

      return res.status(200).json({ message: 'success' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'some error was occurred' });
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
  if (!question) return res.status(400).json({ message: 'no question to delete was provided' });

  const existsFAQ = await FAQ.findOne({});
  if (!existsFAQ) return res.status(404).json({ message: 'cannot find FAQ in database' });

  const itemToDelete = existsFAQ.faq.findIndex((item) => item.question === question);
  if (itemToDelete === -1) return res.status(404).json({ message: 'cannot find that question in database' });

  existsFAQ.faq.splice(itemToDelete, 1);
  await existsFAQ.save();
  await clearCache('FAQ');
  return res.status(201).json(existsFAQ);
};

module.exports = {
  getFAQ,
  addFAQ,
  deleteFAQ,
};
