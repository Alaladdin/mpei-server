const mongoose = require('mongoose');
const shortid = require('shortid');

const UrlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  shortId: { type: String, required: true, default: shortid.generate },
});

module.exports = mongoose.model('url', UrlSchema);