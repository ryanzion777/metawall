const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.js');
const { checkUpload } = require('../middlewares/upload.js');
const { isAuth } = require('../middlewares/auth.js');

// 上傳圖片
router.post('/upload', isAuth, checkUpload, uploadController.postImages);

module.exports = router;
