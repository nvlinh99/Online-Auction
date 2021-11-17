const _ = require('lodash')
const { Router, } = require('express')
const { promisify, } = require('util')
const shortid = require('shortid')
const uploadService = require('../../service/upload-service')

exports.path = '/upload'

const productRouter = Router()
// productRouter.post('/img',  require('../../middleware/auth').authorize, async (req, res) => {
// // productRouter.post('/img', async (req, res) => {
//   const imgList = _.get(req, 'files', null)
//   if (_.isEmpty(imgList)) {
//     return res.json({
//       code: 1000,
//       data:{ loaded: [], },
//     }) 
//   }

//   // __staticPath
//   const tasks = []
//   const uploaded = []
//   for (let i = 0; ;i += 1) {
//     const img = imgList[i]
//     if (!img) break
//     const imgFileName = `${shortid.generate()}.${_.last(_.split(img.name, '.'))}`
//     const imgPath = `/static/images/${imgFileName}`
//     uploaded.push(imgPath)
//     // eslint-disable-next-line no-undef
//     const imgFilePath = `${__staticPath}/images/${imgFileName}`
//     tasks.push(promisify(img.mv)(imgFilePath))
//   }
//   await Promise.all(tasks)

//   return res.json({
//     code: 1000,
//     data: { uploaded, },
//   })
// })

productRouter.post('/img',  require('../../middleware/auth').authorize, async (req, res) => {
  // productRouter.post('/img', async (req, res) => {
  const imgList = _.get(req, 'files', null)
  if (_.isEmpty(imgList)) {
    return res.json({
      code: 1000,
      data:{ loaded: [], },
    }) 
  }
  
  // __staticPath
  const tasks = []
  for (let i = 0; ;i += 1) {
    const img = imgList[i]
    if (!img) break
    tasks.push(uploadService.uploadIMGBB(img))
  }
  const uploadResponse = await Promise.all(tasks).catch(console.log)
  const uploaded = _.map(uploadResponse, 'data.url')
  
  return res.json({
    code: 1000,
    data: { uploaded, },
  })
})

// productRouter.post('/test',  async (req, res) => {
//   // productRouter.post('/img', async (req, res) => {
//   const imgList = _.get(req, 'files', null)
//   if (_.isEmpty(imgList)) {
//     return res.json({
//       code: 1000,
//       data:{ loaded: [], },
//     }) 
//   }
  
//   const uploaded = []
//   const result = await uploadService.upload(imgList[0])
//   console.log(result)
//   return res.json({
//     code: 1000,
//     data: { uploaded, },
//   })
// })

exports.router = productRouter
