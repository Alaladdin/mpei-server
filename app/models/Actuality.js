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
      lazyContent: {
        type: String,
        minlength: 10,
        trim: true,
      },
      date: {
        type: Date,
        default: Date.now,
        required: true,
        index: true,
      },
    },
  },
);

ActualitySchema.index({
  actuality: {
    content: 1,
    lazyContent: 1,
    date: 1,
    shortId: 1,
  },
});

// update Shortid on data update
ActualitySchema.pre(['findOneAndUpdate', 'update', 'updateOne', 'save'], function updateActuality(next) {
  this.update({}, {
    actuality: {
      shortId: shortid.generate(),
      date: Date.now(),
    },
  });

  next();
});

module.exports = mongoose.model('actuality', ActualitySchema, 'actuality');
