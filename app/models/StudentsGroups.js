const mongoose = require('mongoose');

const StudentsGroups = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      maxlength: 20,
      trim: true,
      required: true,
    },
  },
  {
    toObject: {
      versionKey: false,
    },
  },
);

StudentsGroups.index({
  id: 1,
  name: 1,
});

module.exports = mongoose.model('studentsGroups', StudentsGroups, 'studentsGroups');
