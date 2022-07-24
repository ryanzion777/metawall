// Post Controller
const Post = require('../models/Post')
// const User = require('../models/User')
const successHandle = require('../service/successHandle')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const apiMessage = require('../service/apiMessage')

/*
  取得資料庫所有貼文 GET
*/
const getPosts = catchAsync(async (req, res, next) => {
  // q => 搜尋項目
  // s => 資料排序
  const { q, s } = req.query
  const query = q ? { content: new RegExp(q) } : {}
  const sort =
    s === 'hot' ? { likes: -1 } : s === 'new' ? '-createdAt' : 'createdAt'

  const data = await Post.find(query)
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'comments'
    })
    .sort(sort)

  successHandle({
    res,
    message: '取得貼文成功',
    data
  })
})

/*
  取得單一貼文 GET
*/
const getOnlyPost = catchAsync(async (req, res, next) => {
  const { post_id } = req.params

  if (!post_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  const data = await Post.find({
    _id: post_id
  })
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'comments'
    })

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得單一貼文成功',
    data
  })
})

/*
  取得使用者所有貼文 GET
*/
const getUserPosts = catchAsync(async (req, res, next) => {
  // q => 搜尋項目
  // s => 資料排序
  const { target_user_id } = req.params
  const { q, s } = req.query
  const query = q ? { content: new RegExp(q) } : {}
  const sort =
    s === 'hot' ? { likes: -1 } : s === 'new' ? '-createdAt' : 'createdAt'

  if (!target_user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  const data = await Post.find({ user: target_user_id, query })
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'comments'
    })
    .sort(sort)

  successHandle({
    res,
    message: '取得使用者所有貼文成功',
    data
  })
})

/*
  取得使用者按讚的貼文 GET
*/
const getPostLikes = catchAsync(async (req, res, next) => {
  const { target_user_id } = req.params

  if (!target_user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  const data = await Post.find({
    likes: { $in: [target_user_id] }
  }).populate({
    path: 'user',
    select: 'name avatar'
  })

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得使用者按讚的貼文成功',
    data
  })
})

/*
  上傳單一貼文 POST
*/
const createPost = catchAsync(async (req, res, next) => {
  const { content, images } = req.body
  const user_id = req.user_id

  if (!content || !user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  const data = await Post.create({
    user: user_id,
    content,
    images
  })

  successHandle({
    res,
    message: '上傳貼文成功',
    data
  })
})

/*
  更新單一貼文 PATCH
*/
const updatePost = catchAsync(async (req, res, next) => {
  const { post_id } = req.params
  const { content, images } = req.body
  const user_id = req.user_id

  if (!post_id || !content || !user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  const post = await Post.findById(post_id)

  if (post) {
    const nowPatch = {}
    if (images) nowPatch.images = images
    if (content) nowPatch.content = content
    const data = await Post.findByIdAndUpdate(post_id, nowPatch, { new: true })
    successHandle({
      res,
      message: '更新貼文成功',
      data
    })
  } else {
    return next(appError(apiMessage.DATA_NOT_FOUND, next))
  }
})

/*
  刪除單一貼文 DELETE
*/
const deleteOnlyPost = catchAsync(async (req, res, next) => {
  const { post_id } = req.params
  const user_id = req.user_id

  if (!post_id || !user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  const post = await Post.findById(post_id)

  if (post) {
    const data = await Post.findByIdAndDelete(post_id)
    successHandle({
      res,
      message: '刪除單一貼文成功',
      data
    })
  } else {
    return next(appError(apiMessage.DATA_NOT_FOUND, next))
  }
})

/*
  刪除使用者所有貼文 DELETE
*/
const deleteUserPosts = catchAsync(async (req, res, next) => {
  const { target_user_id } = req.params

  if (!target_user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  await Post.deleteMany({ user: target_user_id })

  const data = await Post.find({ user: target_user_id })
  successHandle({
    res,
    message: '刪除使用者所有貼文成功',
    data
  })
})

/*
  刪除資料庫所有貼文 DELETE
*/
const deletePosts = catchAsync(async (req, res, next) => {
  await Post.deleteMany({})
  const data = await Post.find()
  successHandle({
    res,
    message: '刪除所有貼文成功',
    data
  })
})

module.exports = {
  getPosts,
  getUserPosts,
  getOnlyPost,
  getPostLikes,
  createPost,
  updatePost,
  deleteOnlyPost,
  deleteUserPosts,
  deletePosts
}
