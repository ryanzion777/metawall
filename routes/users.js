const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const { isAuth } = require('../controllers/auth.js');


// 取得目前使用者資訊
router.get('/currentUser', isAuth, userController.getCurrentUserInfo);
// 更新目前使用者資訊
router.patch('/currentUser', isAuth, userController.updateCurrentUserInfo);

// 更新密碼
router.patch('/resetPassword', isAuth, userController.updatePassword);

module.exports = router;
