const mongoose = require('mongoose');

const DiscordBotStore = new mongoose.Schema({
  store: {
    type: Object,
    required: true,
  },
});

DiscordBotStore.index({
  store: 1,
});

module.exports = mongoose.model('discordBotStore', DiscordBotStore, 'discordBotStore');
