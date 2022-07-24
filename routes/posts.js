const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')
const { isAuth } = require('../middlewares/auth')

// 取得資料庫所有貼文
router.get('/posts', isAuth, postController.getPosts)

// 取得單一貼文
router.get('/post/1/:post_id', isAuth, postController.getOnlyPost)

// 取得使用者所有貼文
router.get('/posts/user/:target_user_id', isAuth, postController.getUserPosts)

// 取得使用者按讚的貼文
router.get('/posts/likes/:target_user_id', isAuth, postController.getPostLikes)

// 上傳單一貼文
router.post('/post/1', isAuth, postController.createPost)

// 更新單一貼文
router.patch('/post/1/:post_id', isAuth, postController.updatePost)

// 刪除單一貼文
router.delete('/post/1/:post_id', isAuth, postController.deleteOnlyPost)

// 刪除使用者所有貼文
router.delete(
  '/posts/user/:target_user_id',
  isAuth,
  postController.deleteUserPosts
)

// 刪除所有貼文
router.delete('/posts', isAuth, postController.deletePosts)

module.exports = router
