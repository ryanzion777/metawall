const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.js');
const { isAuth } = require('../middlewares/auth.js');

// 取得按讚貼文數量
router.get('/likes', isAuth, likeController.getPostLikes);

// 按讚貼文 與 取消讚貼文
router.post('/likes', isAuth, likeController.togglePostLikes);

module.exports = router;