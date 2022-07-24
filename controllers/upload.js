// upload Controller
const successHandle = require('../service/successHandle')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const { ImgurClient } = require('imgur')

/*
  上傳圖片 POST
*/
const postImages = catchAsync(async (req, res, next) => {
  if (!req.files.length) {
    return next(
      appError(
        {
          message: '尚無上傳圖片！',
          statusCode: 500
        },
        next
      )
    )
  }
  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN
  })
  const images = []
  for await (const file of req.files) {
    const response = await client.upload({
      image: file.buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    })
    images.push(response.data.link)
  }
  successHandle({
    res,
    message: '上傳圖片成功！',
    data: {
      images
    }
  })
})

module.exports = {
  postImages
}
