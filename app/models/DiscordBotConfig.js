const mongoose = require('mongoose');

const DiscordBotConfig = new mongoose.Schema({
  config: {
    type: Object,
    required: true,
  },
});

DiscordBotConfig.index({
  config: 1,
});

module.exports = mongoose.model('discordBotConfig', DiscordBotConfig, 'discordBotConfig');
