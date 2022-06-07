const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, '使用者 為必填']
    },
    content: {
      type: String,
      required: [true, '貼文內容 為必填']
    },
    image: {
      type: String,
      default: ''
    },
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