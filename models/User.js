const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const validator = require('validator');

const userSchema = new Schema(
  {
    // 暱稱
    name: {
      type: String,
      required: [true, '暱稱 為必填'],
      minlength: 2,
    },
    // Email
    email: {
      type: String,
      required: [true, 'Email 為必填'],
      unique: true,
      validate: [validator.isEmail, 'Email 格式錯誤'],
    },
    // 密碼 Never Show to user
    password: {
      type: String,
      required: [true, '密碼 為必填'],
      min: [8, '密碼至少 8 碼以上'],
      trim: true,
      select: false, 
    },
    // 性別
    gender: {
      type: String,
      required: false,
      enum: {
        values: ['male', 'female'],
        message: '不接受 {VALUE}，僅接受 male, female',
      },
    },
    // 大頭照 驗證解析度寬度至少 300、圖片寬高比 1:1
    avatar: {
      type: String,
      required: false,
      default: ' ',
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

const User = model('User', userSchema);

module.exports = User;