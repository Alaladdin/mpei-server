const mongoose = require('mongoose');

const VKBotStoreSchema = new mongoose.Schema({
  store: {
    type: Object,
    required: true,
  },
});

VKBotStoreSchema.index({
  config: 1,
});

module.exports = mongoose.model('VKBotStore', VKBotStoreSchema, 'VKBotStore');
