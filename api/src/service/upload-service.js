const cloudinary = require('cloudinary').v2
const _ = require('lodash')
const { promisify, } = require('util')
const shortid = require('shortid')
const fs = require('fs')
const ImgBB = require('imgbb').default

const imgbbAPI = new ImgBB({
  token: process.env.IMGBB_API_KEY,
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

exports.upload = async (file) => {
  const imgFileName = `${shortid.generate()}.${_.last(_.split(file.name, '.'))}`
  // eslint-disable-next-line no-undef
  const imgFilePath = `${__staticPath}/images/${imgFileName}`
  await promisify(file.mv)(imgFilePath)
  const result = await new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream(function (err, rst) {
      if (err) return rej(err)
      return res((rst))
    })
    fs.createReadStream(imgFilePath).pipe(stream)
  })
  fs.unlink(imgFilePath, () => {})
  return result
}

exports.uploadIMGBB = async (file) => {
  const imgFileName = `${shortid.generate()}.${_.last(_.split(file.name, '.'))}`
  // eslint-disable-next-line no-undef
  return imgbbAPI.upload({
    name: imgFileName,
    image: file.data,
  })
}
