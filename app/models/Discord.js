const mongoose = require('mongoose');

const DiscordSchema = new mongoose.Schema(
  {
    actuality: {
      content: {
        type: String,
        minlength: 10,
        trim: true,
      },
      date: {
        type: Date,
        default: Date.now,
        index: true,
      },
    },
  },
);

DiscordSchema.index({
  actuality: {
    content: 1,
    date: 1,
  },
});

module.exports = mongoose.model('discord', DiscordSchema, 'discord');
