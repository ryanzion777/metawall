const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.js');
const { isAuth } = require('../middlewares/auth.js');

// 取得貼文留言
router.get('/comments/:post_id', isAuth, commentController.getComments);

// 新增貼文留言
router.post('/comment/1/:post_id', isAuth, commentController.postComment);

// 更新貼文留言
router.patch('/comment/1/:comment_id', isAuth, commentController.updateComment);

// 刪除貼文留言
router.delete('/comment/1/:comment_id', isAuth, commentController.deleteComment);

module.exports = router;