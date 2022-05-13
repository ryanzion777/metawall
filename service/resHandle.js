
const successHandle = ({
  res,
  data
}) => {
  res.send({
    status: true,
    data
  }).end()
}

const errorHandle = ({
  res,
  statusCode= 400,
  message='操作錯誤，請查看錯誤訊息',
  error
}) => {
  res.status(statusCode).send({
    status: false,
    message,
    error
  }).end()
}

module.exports = {
  errorHandle, successHandle
}
