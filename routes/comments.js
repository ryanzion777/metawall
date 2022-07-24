const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment')
const { isAuth } = require('../middlewares/auth')

// 取得貼文留言
router.get('/comments/:post_id', isAuth, commentController.getComments)

// 新增貼文留言
router.post('/comment/1/:post_id', isAuth, commentController.postComment)

// 更新貼文留言
router.patch('/comment/1/:comment_id', isAuth, commentController.updateComment)

// 刪除貼文留言
router.delete(
  '/comment/1/:comment_id',
  isAuth,
  commentController.deleteComment
)

// 新增回覆留言
router.post(
  '/comment/reply/1/:post_id/:comment_id',
  isAuth,
  commentController.postCommentReply
)

// 更新回覆留言
router.patch('/comment/reply/1/:reply_id', isAuth, commentController.updateCommentReply)

// 刪除回覆留言
router.delete('/comment/reply/1/:reply_id', isAuth, commentController.deleteCommentReply)

module.exports = router
