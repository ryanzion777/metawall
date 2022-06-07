// User Controller
const User = require('../models/User.js');
const { successHandle } = require('../service/resHandle');
const catchAsync = require('../service/catchAsync');
const appError = require('../service/appError');
const apiMessage = require('../service/apiMessage');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/*
  取得目前使用者資訊 GET
*/
const getCurrentUserInfo = async(req, res, next) => {
  const { user } = req;
  const data = await User.findById(user?.id);
  if(!data) {
    return next(appError(apiMessage.ID_FAIL, next))
  }
  return successHandle({
    res, message: '取得當前使用者資料成功', data
  });
};

/*
  更新目前使用者資訊 PATCH
*/
const updateCurrentUserInfo = async(req, res, next) => {
  const { user } = req;
  let { name, avatar, gender } = req.body;
  let newData = {};

  if(name !== undefined && name?.length >= 2) {
    newData.name = name;
  } else {
    return next(appError({
      message: '暱稱至少 ２ 字元以上',
      statusCode: 400
    }, next));
  }

  if(avatar !== undefined) {
    newData.avatar = avatar;
  }

  if(gender !== undefined) {
    const values = ['male', 'female'];
    if (!values.some((item) => item === gender)) {
      return next(appError({
        message: '請選擇性別',
        statusCode: 400
      }, next));
    }
    newData.gender = gender;
  }

  const data = await User.findByIdAndUpdate(
    user?.id, 
    newData, 
    { runValidators: true, new: true }
  )
  if (!data) {
    return next(appError(apiMessage.ID_FAIL, next))
  }
  successHandle({ res, message: '更新當前使用者資料成功', data })
};

/*
  更新密碼 PATCH
*/
const updatePassword = async(req, res, next) => {
  let { password, confirmPassword } = req.body;
  const { user } = req;
  const errCode = 400;

  // 驗證項目不得為空
  if(!password || !confirmPassword) {
    return next(appError({
      message: '填入項目不得為空',
      statusCode: errCode
    }, next));
  }
  // 驗證密碼是否超過８位數
  if(!validator.isLength(password, { min: 8 })) {
    return next(appError({
      message: '密碼至少 8 碼以上',
      statusCode: errCode
    }, next));
  }
  // 驗證密碼是否一致
  if(password !== confirmPassword) {
    return next(appError({
      message: '密碼不一致',
      statusCode: errCode
    }, next));
  }

  // 加密密碼
  const newPassword = await bcrypt.hash(password, 12);

  // 更新
  const data = await User.findByIdAndUpdate(
    user?.id,
    { password: newPassword },
    { new: true, runValidators: true }
  );
  if (!data) {
    return next(appError(apiMessage.ID_FAIL, next))
  }
  successHandle({
    res, message: '更新密碼成功'
  });
};

module.exports = {
  getCurrentUserInfo, updateCurrentUserInfo, updatePassword
};
