// Post Controller
const Post = require('../models/Post');
const User = require('../models/User');
const successHandle = require('../service/successHandle');
const catchAsync = require('../service/catchAsync');
const appError = require('../service/appError');
const apiMessage = require('../service/apiMessage');

/*
  取得資料庫所有貼文 GET
*/
const getAllData = catchAsync(async(req, res, next) => {
  // q => 搜尋項目
  // s => 資料排序
  const { q, s } = req.query;
  const query = q ? { 'content': new RegExp(q) } : {};
  const sort = s === 'hot' ? { likes: -1 } : s === 'new' ? '-createdAt' : 'createdAt';

  const data = await Post.find(query)
    .populate({
      path: 'user',
      select: 'name image'
    }).sort(sort);

  successHandle({
    res, message: '取得貼文成功', data
  });
});

/*
  取得當前使用者所有貼文 GET
*/
const getCurrentUserAllData = catchAsync(async(req, res, next) => {
  // q => 搜尋項目
  // s => 資料排序
  const { q, s } = req.query;
  const user_id = req.user_id;
  const query = q ? { 'content': new RegExp(q) } : {};
  const sort = s === 'hot' ? { likes: -1 } : s === 'new' ? '-createdAt' : 'createdAt';

  const data = await Post.find({ user: user_id, query })
    .populate({
      path: 'user',
      select: 'name image'
    }).sort(sort);

  successHandle({
    res, message: '取得貼文成功', data
  });
});

/*
  上傳單一貼文 POST
*/
const postData = catchAsync(async(req, res, next) => {
  const { content, images, likes } = req.body;
  const user_id = req.user_id;

  if(!content || !user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next));
  }

  const data = await Post.create({
    user: user_id, 
    content, 
    images, 
    likes
  });

  successHandle({
    res, message: '上傳貼文成功', data
  });
});

/*
  更新單一貼文 PATCH
*/
const updateData = catchAsync(async(req, res, next) => {
  const { post_id } = req.params;
  const { content, images } = req.body;
  const user_id = req.user_id;

  if(!post_id || !content || !user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next));
  }

  const post = await Post.findById(post_id);

  if(post) {
    const nowPatch = {};
    if(images) nowPatch.images = images;
    if(content) nowPatch.content = content;
    const data = await Post.findByIdAndUpdate(post_id, nowPatch, { new: true });
    successHandle({
      res, message: '更新貼文成功', data
    });
  }
  else {
    return next(appError(apiMessage.DATA_NOT_FOUND, next));
  }
});

/*
  刪除單一貼文 DELETE
*/
const deleteData = catchAsync(async(req, res, next) => {
  const { post_id } = req.params;
  const user_id = req.user_id;
  
  if(!post_id || !user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next));
  }

  const post = await Post.findById(post_id);

  if(post) {
    const data = await Post.findByIdAndDelete(post_id);
    successHandle({
      res, message: '刪除單一貼文成功', data
    });
  }
  else {
    return next(appError(apiMessage.DATA_NOT_FOUND, next));
  }
});

/*
  刪除所有貼文 DELETE
*/
const deleteAllData = catchAsync(async(req, res, next) => {
  await Post.deleteMany({});
  const data = await Post.find();
  successHandle({
    res, message: '刪除所有貼文成功', data
  });
});


module.exports = {
  getAllData, getCurrentUserAllData, postData, updateData, deleteData, deleteAllData
};