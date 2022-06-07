var express = require('express');
var router = express.Router();
var postController = require('../controllers/post');

router.get('/', postController.getAllData);

router.post('/', postController.postData);

router.patch('/:id', postController.updateData);

router.delete('/:id', postController.deleteData);

router.delete('/', postController.deleteAllData);

module.exports = router;
