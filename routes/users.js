const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.js');
const { isAuth } = require('../middlewares/auth.js');

// 取得目前使用者資訊
router.get('/users/current_user', isAuth, userController.getCurrentUserInfo);

// 更新目前使用者資訊
router.patch('/users/current_user', isAuth, userController.updateCurrentUserInfo);

// 更新密碼
router.patch('/users/reset_password', isAuth, userController.updatePassword);

module.exports = router;
