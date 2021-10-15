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
    .populate('categoryInfo')
    .populate({
      path:'currentBid',
      populate: 'bidder',
      match: { status: 0, },
      options:{
        sort:{
          price:-1,
          
        },
      },
    })
    .limit(limit)
    .sort({ expiredDate: 1, })
    .lean()
}

exports.getTopBidedProducts = async function (limit) {
  return ProductModel
    .find({ expiredDate: { $gte: new Date(), }, })
    .populate('categoryInfo')
    .populate({
      path:'currentBid',
      populate: 'bidder',
      match: { status: 0, },
      options:{
        sort:{
          price:-1,
          
        },
      },
    })
    .limit(limit)
    .sort({ totalBid: -1, })
    .lean()
}

exports.getTopPriceProducts = async function (limit) {
  return ProductModel
    .find({ expiredDate: { $gte: new Date(), }, })
    .populate('categoryInfo')
    .populate({
      path:'currentBid',
      populate: 'bidder',
      match: { status: 0, },
      options:{
        sort:{
          price:-1,
          
        },
      },
    })
    .limit(limit)
    .sort({ currentPrice: -1, })
    .lean()
}

function transformBiderInfo(prod) {
  prod.biderInfo = _.get(prod, 'currentBid.bidder', null)
}
exports.getTopProducts = async function (limit = TOP_COUNT) {
  const [
    topExpireProducts, 
    topBidedProducts, 
    topPriceProducts,
  ] = await Promise.all([
    exports.getTopExpireProducts(limit), 
    exports.getTopBidedProducts(limit), 
    exports.getTopPriceProducts(limit),
  ])
  
  _.forEach(topExpireProducts, transformBiderInfo)
  _.forEach(topBidedProducts, transformBiderInfo)
  _.forEach(topPriceProducts, transformBiderInfo)
  return [topExpireProducts, topBidedProducts, topPriceProducts,]
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
    .populate('totalBids')
    .populate({
      path:'currentBid',
      populate: 'bidder',
      match: { status: 0, },
      options:{
        sort:{
          price:-1,
          
        },
      },
    })
    .populate({
      path:'watchList',
   
      transform:(doc) => doc && doc.userId,
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean()
  const totalItems = await ProductModel.countDocuments(filter, ...args)
  const totalPages = Math.ceil(totalItems / limit)

  const newTime = moment().subtract(N_MIN_MARK_NEW, 'minutes').toDate()
  _.forEach(products, (product) => {
    delete product.score
    if (product.createdAt > newTime) product.isNew = true
  })
  return {
    totalItems,
    items: products,
    totalPages,
    currentPage: page,
  }
}

function pageToSkipAndLimit(page) {
  const skip = (page - 1) * N_ITEMS_PER_PAGE
  const limit = N_ITEMS_PER_PAGE
  return [skip, limit,]
}
