// Like Controller
const Post = require('../models/Post');
const User = require('../models/User.js');
const successHandle = require('../service/successHandle');
const catchAsync = require('../service/catchAsync');
const appError = require('../service/appError');
const apiMessage = require('../service/apiMessage');

/*
  取得按讚貼文數量 GET
*/
const getPostLikes = catchAsync(async(req, res, next) => {
  const { post_id } = req.query;

  if(!post_id) return next(appError(apiMessage.FIELD_FAILED, next));

  const data = await Post.findById(post_id).select('_id likes');

  if(!data) return next(appError(apiMessage.DATA_NOT_FOUND, next));

  successHandle({
    res, 
    message: '取得按讚貼文數量成功',
    data: {
      likeLength: data.likes.length,
      nowPost: data
    }
  });
});

/*
  按讚貼文 與 取消讚貼文 POST
*/
const togglePostLikes = catchAsync(async(req, res, next) => {
  const { post_id, likeMode } = req.query;
  const user_id = req.user_id;
  let likeToggle = likeMode === 'add' ? true : false;
  let data;

  if(!post_id || !likeMode) return next(appError(apiMessage.FIELD_FAILED, next));

  if(likeToggle) {
    data = await Post.findOneAndUpdate(
      { _id: post_id },
      { 
        $addToSet: { 
          likes: user_id
        }
      },
      { new: true }
    );
  }
  else {
    data = await Post.findOneAndUpdate(
      { _id: post_id },
      { 
        $pull: { 
          likes: user_id
        }
      },
      { new: true }
    );
  }

  if(!data) return next(appError(apiMessage.DATA_NOT_FOUND, next));

  if(likeToggle) {
    successHandle({
      res, message: '已成功按讚', data
    });
  }
  else {
    successHandle({
      res, message: '已取消按讚', data
    });
  }
});

module.exports = {
  getPostLikes, togglePostLikes
};