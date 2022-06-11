const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const { isAuth } = require('../middlewares/auth.js');

// 取得資料庫所有貼文
router.get('/posts', isAuth, postController.getAllData);

// 取得當前使用者所有貼文
router.get('/posts/current_user', isAuth, postController.getCurrentUserAllData);

// 上傳單一貼文
router.post('/post/1', isAuth, postController.postData);

// 更新單一貼文
router.patch('/post/1/:post_id', isAuth, postController.updateData);

// 刪除單一貼文
router.delete('/post/1/:post_id', isAuth, postController.deleteData);

// 刪除所有貼文
router.delete('/posts', isAuth, postController.deleteAllData);

module.exports = router;
