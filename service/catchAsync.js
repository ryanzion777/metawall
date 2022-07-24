// 代替 try catch 語法
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next)
}

module.exports = catchAsync
