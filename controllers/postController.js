// Post Controller
const { successHandle, errorHandle } = require('../service/resHandle');
const Post = require('../models/Post');
const User = require('../models/User');

const getAllData = async(req, res) => {
  // q => 搜尋項目
  // s => 資料排序
  try {
    const { q, s } = req.query
    const query = q ? { 'content': new RegExp(q) } : {};
    const sort = s === 'hot' ? { likes: -1 } : s === 'new' ? 'createdAt' : '-createdAt';
    const data = await Post.find(query).populate({
      path: 'user',
      select: 'name image'
    }).sort(sort);
    successHandle({
      res, data
    });
  }
  catch(error) {
    errorHandle({
      res, error
    });
  }
};

const postData = async(req, res) => {
  try {
    const { body } = req;
    const { user, content, image, likes } = body;
    const data = await Post.create({
      user, content, image, likes
    });
    successHandle({
      res, data
    });
  }
  catch(error) {
    errorHandle({
      res, error
    });
  }
};

const patchData = async(req, res) => {
  try {
    const { id } = req.params;
    const { user, content } = req.body;
    const hasID = await Post.findById(id);
    if(hasID) {
      const nowPatch = {};
      if(user) nowPatch.user = user;
      if(content) nowPatch.content = content;
      await Post.findByIdAndUpdate(id, nowPatch);
      const data = await Post.findById(id);
      successHandle({
        res, data
      });
    }
    else {
      errorHandle({
        res, message: '找不到對應ID'
      });
    }
  }
  catch(error) {
    errorHandle({
      res, error
    });
  }
};

const deleteData = async(req, res) => {
  try {
    const { id } = req.params;
    const hasID = await Post.findById(id);
    if(hasID) {
      const data = await Post.findByIdAndDelete(id);
      successHandle({
        res, data
      });
    }
    else {
      errorHandle({
        res, message: '找不到對應ID'
      });
    }
  }
  catch(error) {
    errorHandle({
      res, error
    });
  }
};

const deleteAllData = async(req, res) => {
  await Post.deleteMany({});
  const data = await Post.find();
  successHandle({
    res, data
  });
};

module.exports = {
  getAllData, postData, patchData, deleteData, deleteAllData
};