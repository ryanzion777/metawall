const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'user is required']
    },
    content: {
      type: String,
      required: [true, 'content is required']
    },
    image: {
      type: String,
      default: ''
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: 0
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, 
  {
    versionKey: false
  }
);

const Post = model('Post', postSchema);

module.exports = Post;