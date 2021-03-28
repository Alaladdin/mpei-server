const mongoose = require('mongoose');

const StudentsGroupsSchema = new mongoose.Schema(
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
);

StudentsGroupsSchema.index({
  title: 1,
  id: 1,
});

module.exports = mongoose.model('studentsGroups', StudentsGroupsSchema, 'studentsGroups');
