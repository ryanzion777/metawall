// User Controller
// const Post = require('../models/Post')
const User = require('../models/User')
const successHandle = require('../service/successHandle')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const apiMessage = require('../service/apiMessage')
const validator = require('validator')
const bcrypt = require('bcryptjs')

/*
  取得目前使用者資訊 GET
*/
const getCurrentUserInfo = catchAsync(async (req, res, next) => {
  const user_id = req.user_id

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  const data = await User.findById(user_id)

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得當前使用者資料成功',
    data
  })
})

/*
  更新目前使用者資訊 PATCH
*/
const updateCurrentUserInfo = catchAsync(async (req, res, next) => {
  const user_id = req.user_id
  let { name, avatar, gender } = req.body
  const new_data = {}
  name = name.trim()

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  if (name !== undefined && name?.length >= 2) {
    new_data.name = name
  } else {
    return next(
      appError(
        {
          message: '暱稱至少 ２ 字元以上',
          statusCode: 400
        },
        next
      )
    )
  }

  if (avatar !== undefined) {
    new_data.avatar = avatar
  }

  if (gender !== undefined) {
    const values = ['male', 'female']
    if (!values.some((item) => item === gender)) {
      return next(
        appError(
          {
            message: '請選擇性別',
            statusCode: 400
          },
          next
        )
      )
    }
    new_data.gender = gender
  }

  const data = await User.findByIdAndUpdate(user_id, new_data, {
    runValidators: true,
    new: true
  })
  if (!data) {
    return next(appError(apiMessage.DATA_NOT_FOUND, next))
  }

  successHandle({ res, message: '更新當前使用者資料成功', data })
})

/*
  更新密碼 PATCH
*/
const updatePassword = catchAsync(async (req, res, next) => {
  const { password, confirm_password } = req.body
  const user_id = req.user_id
  const err_code = 400

  // 驗證項目不得為空
  if (!password || !confirm_password) {
    return next(
      appError(
        {
          message: '填入項目不得為空',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否中英混合
  if (!/(?=\w*\d)(?=\w*[a-zA-Z])\w+/.test(password)) {
    return next(
      appError(
        {
          message: '密碼應該為中英混合',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否超過８位數
  if (!validator.isLength(password, { min: 8 })) {
    return next(
      appError(
        {
          message: '密碼至少 8 碼以上',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否一致
  if (password !== confirm_password) {
    return next(
      appError(
        {
          message: '密碼不一致',
          statusCode: err_code
        },
        next
      )
    )
  }

  // 加密密碼
  const new_password = await bcrypt.hash(password, 12)

  // 更新
  const data = await User.findByIdAndUpdate(
    user_id,
    { password: new_password },
    { new: true, runValidators: true }
  )
  if (!data) {
    return next(appError(apiMessage.DATA_NOT_FOUND, next))
  }
  successHandle({
    res,
    message: '更新密碼成功'
  })
})

module.exports = {
  getCurrentUserInfo,
  updateCurrentUserInfo,
  updatePassword
}
