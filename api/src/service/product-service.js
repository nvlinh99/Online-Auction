const _ = require('lodash')
const moment = require('moment')
const ProductModel = require('../model/product')
const CategoryService = require('./category-service')

const TOP_COUNT = 5
const N_ITEMS_PER_PAGE = 25
const N_MIN_MARK_NEW = 15

exports.getTopExpireProducts = async function (limit) {
  return ProductModel
    .find({ expiredDate: { $gte: new Date(), }, })
    .limit(limit)
    .sort({ expiredDate: -1, })
    .lean()
}

exports.getTopRateProducts = async function (limit) {
  return []
}

exports.getTopPriceProducts = async function (limit) {
  return ProductModel
    .find({})
    .limit(limit)
    .sort({ currentPrice: -1, })
    .lean()
}

exports.getTopProducts = async function (limit = TOP_COUNT) {
  const [
    topExpireProducts, 
    topRateProducts, 
    topPriceProducts,
  ] = await Promise.all([
    exports.getTopExpireProducts(limit), 
    exports.getTopRateProducts(limit), 
    exports.getTopPriceProducts(limit),
  ])

  return [topExpireProducts, topRateProducts, topPriceProducts,]
}

exports.getProductsWithPaging = async function ({ categoryId, textSearch, page = 1, }, sort = {}) {
  const [skip, limit,] = pageToSkipAndLimit(page)
  const filter = {}
  const args = []
  if (textSearch) {
    filter.$text = { $search: textSearch, }
    args.push({ score : { $meta: 'textScore', }, })
    sort = {
      score: { $meta : 'textScore', },
      ...sort,
    }
  }
  if (categoryId) {
    const categories = await CategoryService.getCategoriesExpandChilds(categoryId)
    const categoryIds = _.map(categories, 'id') || []
    filter.categoryId = { $in: categoryIds , }
  }
  
  const products = await ProductModel.find(filter, ...args)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .lean()

  const newTime = moment().subtract(N_MIN_MARK_NEW, 'minutes').toDate()
  _.forEach(products, (product) => {
    delete product.score
    if (product.createdAt > newTime) product.isNew = true
  })
  return products
}

function pageToSkipAndLimit(page) {
  const skip = (page - 1) * N_ITEMS_PER_PAGE
  const limit = N_ITEMS_PER_PAGE
  return [skip, limit,]
}