const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload");
const { checkUpload } = require("../middlewares/upload");
const { isAuth } = require("../middlewares/auth");

// 上傳圖片
router.post("/upload", isAuth, checkUpload, uploadController.postImages);

module.exports = router;
