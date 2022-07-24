const express = require('express')
const router = express.Router()
const likeController = require('../controllers/like')
const { isAuth } = require('../middlewares/auth')

// 取得貼文按讚數量
router.get('/likes', isAuth, likeController.getPostLikes)

// 按讚貼文 與 取消讚貼文
router.patch('/likes', isAuth, likeController.togglePostLikes)

module.exports = router
