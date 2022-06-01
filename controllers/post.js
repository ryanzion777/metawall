// Post Controller
const { successHandle } = require('../service/resHandle');
const Post = require('../models/Post');
const User = require('../models/User');
const catchAsync = require('../service/catchAsync');
const appError = require('../service/appError');
const apiMessage = require('../service/apiMessage');

const getAllData = catchAsync(async(req, res, next) => {
  // q => 搜尋項目
  // s => 資料排序
  const { q, s } = req.query
  const query = q ? { 'content': new RegExp(q) } : {};
  const sort = s === 'hot' ? { likes: -1 } : s === 'new' ? 'createdAt' : '-createdAt';
  const data = await Post.find(query).populate({
    path: 'user',
    select: 'name image'
  }).sort(sort);
  successHandle({
    res, message: 'Get All Post', data
  });
});

const postData = catchAsync(async(req, res, next) => {
  const { body } = req;
  const { user, content, image, likes } = body;
  if(content) {
    const data = await Post.create({
      user: '6291e582af948f819c6e5a58',
      content, image, likes
    });
    successHandle({
      res, message: 'Post One Post', data
    });
  }
  else {
    return next(appError(apiMessage.FIELD_FAIL, next))
  }
});

const patchData = catchAsync(async(req, res, next) => {
  const { id } = req.params;
  const { user, content } = req.body;
  const hasID = await Post.findById(id);
  if(hasID) {
    const nowPatch = {};
    if(user) nowPatch.user = user;
    if(content) nowPatch.content = content;
    const data = await Post.findByIdAndUpdate(id, nowPatch, {new: true});
    successHandle({
      res, message: 'Patch One Post', data
    });
  }
  else {
    return next(appError(apiMessage.ID_FAIL, next))
  }
});

const deleteData = catchAsync(async(req, res, next) => {
  const { id } = req.params;
  const hasID = await Post.findById(id);
  if(hasID) {
    const data = await Post.findByIdAndDelete(id);
    successHandle({
      res, message: 'Delete One Post', data
    });
  }
  else {
    return next(appError(apiMessage.ID_FAIL, next))
  }
});

const deleteAllData = catchAsync(async(req, res, next) => {
  await Post.deleteMany({});
  const data = await Post.find();
  successHandle({
    res, message: 'Delete All Posts', data
  });
});

module.exports = {
  getAllData, postData, patchData, deleteData, deleteAllData
};