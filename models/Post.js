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
    images: {
      type: String,
      default: ''
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }],
    createdAt: {
      type: Number,
    },
    updatedAt: {
      type: Number,
    }
  }, 
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

const Post = model('Post', postSchema);

module.exports = Post;