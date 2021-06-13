const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  faq: {
    type: Array,
    required: true,
  },
});

FAQSchema.index({
  faq: 1,
});

module.exports = mongoose.model('FAQ', FAQSchema, 'FAQ');
