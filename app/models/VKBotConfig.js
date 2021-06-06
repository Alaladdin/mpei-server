const mongoose = require('mongoose');

const VKBotConfig = new mongoose.Schema({
  config: {
    type: Object,
    required: true,
  },
});

VKBotConfig.index({
  config: 1,
});

module.exports = mongoose.model('VKBotConfig', VKBotConfig, 'VKBotConfig');
