const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'field-name is required.']
    },
    email: {
      type: String,
      required: [true, 'field-email is required.'],
      unique: true,
      select: false
    },
    image: {
      type: String,
      default: ''
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        default: 0
      }
    ],
    tracks: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: 0
      }
    ]
  }, 
  {
    versionKey: false
  }
);

const User = model('User', userSchema);

module.exports = User;