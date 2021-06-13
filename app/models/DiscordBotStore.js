const mongoose = require('mongoose');

const DiscordBotStoreSchema = new mongoose.Schema({
  store: {
    type: Object,
    required: true,
  },
});

DiscordBotStoreSchema.index({
  store: 1,
});

module.exports = mongoose.model('discordBotStore', DiscordBotStoreSchema, 'discordBotStore');
