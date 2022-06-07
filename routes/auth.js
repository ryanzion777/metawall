const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');

// 登入
router.post('/signup', authController.signup);
// 註冊
router.post('/login', authController.login);
// 登出
router.post('/logout', authController.logout);
// 驗證token
router.get('/check', authController.checkToken);

module.exports = router;