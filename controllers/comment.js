// Comment Controller
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const successHandle = require("../service/successHandle");
const catchAsync = require("../service/catchAsync");
const appError = require("../service/appError");
const apiMessage = require("../service/apiMessage");

/*
  取得貼文留言 GET
*/
const getComments = catchAsync(async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req;

  if (!user_id || !post_id) {
    return next(appError(apiMessage.FIELD_FAILED, next));
  }

  const data = await Post.findById(post_id).populate({
    path: "comments",
  });

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next));

  successHandle({
    res,
    message: "取得貼文留言成功",
    data: {
      now_comments: data.comments,
      now_post: data,
    },
  });
});

/*
  新增貼文留言 POST
*/
const postComment = catchAsync(async (req, res, next) => {
  const { post_id } = req.params;
  const { user_id } = req;
  const { content } = req.body;

  if (!user_id || !post_id || !content) {
    return next(appError(apiMessage.FIELD_FAILED, next));
  }

  const data = await Comment.create({
    user: user_id,
    post: post_id,
    content,
  });

  successHandle({
    res,
    message: "新增貼文留言成功",
    data,
  });
});

/*
  更新貼文留言 PATCH
*/
const updateComment = catchAsync(async (req, res, next) => {
  const { comment_id } = req.params;
  const { user_id } = req;
  const { content } = req.body;

  if (!comment_id || !user_id || !content) {
    return next(appError(apiMessage.FIELD_FAILED, next));
  }

  const comment = await Comment.findById(comment_id);

  if (comment) {
    const data = await Comment.findOneAndUpdate(
      { _id: comment_id, post: comment.post },
      { content },
      { new: true }
    );
    successHandle({
      res,
      message: "更新貼文留言成功",
      data,
    });
  } else {
    return next(appError(apiMessage.DATA_NOT_FOUND, next));
  }
});

/*
  刪除貼文留言 DELETE
*/
const deleteComment = catchAsync(async (req, res, next) => {
  const { comment_id } = req.params;
  const { user_id } = req;

  if (!user_id || !comment_id) {
    return next(appError(apiMessage.FIELD_FAILED, next));
  }

  const comment = await Comment.findById(comment_id);

  if (comment) {
    const data = await Comment.findOneAndDelete({
      _id: comment_id,
      post: comment.post,
    });
    successHandle({
      res,
      message: "刪除貼文留言成功",
      data,
    });
  } else {
    return next(appError(apiMessage.DATA_NOT_FOUND, next));
  }
});

module.exports = {
  getComments,
  postComment,
  updateComment,
  deleteComment,
};
