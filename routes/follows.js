const express = require('express')
const router = express.Router()
const followController = require('../controllers/follow')
const { isAuth } = require('../middlewares/auth')

// 取得追蹤名單
router.get('/follows_list', isAuth, followController.getFollowsList)

// 追蹤 與 取消追蹤
router.patch('/follows', isAuth, followController.toggleFollows)

module.exports = router
