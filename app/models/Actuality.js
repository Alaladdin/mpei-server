const mongoose = require('mongoose');
const shortid = require('shortid');

const ActualitySchema = new mongoose.Schema(
  {
    actuality: {
      shortId: {
        type: String,
        required: true,
        default: shortid.generate,
      },
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

ActualitySchema.index({
  actuality: {
    content: 1,
    date: 1,
  },
});

// update Shortid on data update
ActualitySchema.pre('findOneAndReplace', function updateShortid(next) {
  this.update({}, { shortid: shortid.generate() });
  next();
});

module.exports = mongoose.model('actuality', ActualitySchema, 'actuality');
