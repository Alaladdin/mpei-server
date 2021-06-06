const mongoose = require('mongoose');

const VKBotStore = new mongoose.Schema({
  store: {
    type: Object,
    required: true,
  },
});

VKBotStore.index({
  config: 1,
});

module.exports = mongoose.model('VKBotStore', VKBotStore, 'VKBotStore');
