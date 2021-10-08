import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'

export function calcTimeLeft(t1, t2) {
  t1 = moment(t1)
  t2 = moment(t2)
  const max = Math.max(t2.toDate(), t1.toDate())
  const min = Math.min(t2.toDate(), t1.toDate())
  moment(new Date(max)).diff(moment(new Date(min)))
  const duration = moment.duration(
    moment(new Date(max)).diff(moment(new Date(min)))
  )

  const hours = Math.floor(duration.asHours())
  const minutes = duration.minutes()
  const seconds = duration.seconds()

  let parseTime = null
  if (hours > 0) {
    parseTime = `${hours} giờ ${minutes} phút ${seconds} giây`
  } else if (minutes > 0) {
    parseTime = `${minutes} phút ${seconds} giây`
  } else parseTime = `${seconds} giây`
  return [hours, minutes, seconds, parseTime]
}

export function formatProductItem(product) {
  const result = {}

  // basic info
  result.id = _.get(product, 'id', null)
  result.title = _.get(product, 'title')
  result.avatarUrl = _.get(product, 'avatarUrl', null)
  result.imageUrls = _.get(product, 'imageUrls', null)
  result.totalBid = _.get(product, 'totalBid', null)

  // cate info
  result.categoryId = _.get(product, 'categoryInfo.id', null)
  result.categoryTitle = _.get(product, 'categoryInfo.title', null)

  // prices info
  result.startPrice = _.get(product, 'startPrice', null)
  if (result.startPrice)
    result.formatedStartPrice = numeral(result.startPrice).format(0, 0)

  result.currentPrice = _.get(product, 'currentPrice', null)
  if (result.currentPrice)
    result.formatedCurrentPrice = numeral(result.currentPrice).format(0, 0)

  result.purchasePrice = _.get(product, 'purchasePrice', null)
  if (result.purchasePrice)
    result.formatedPurchasePrice = numeral(result.purchasePrice).format(0, 0)

  result.stepPrice = _.get(product, 'stepPrice', null)
  if (result.stepPrice)
    result.formatedStepPrice = numeral(result.stepPrice).format(0, 0)

  // bider info
  result.biderId = _.get(product, 'biderInfo.id', null)
  result.biderFirstname = _.get(product, 'biderInfo.firstName', null)
  result.biderLastname = _.get(product, 'biderInfo.lastName', null)
  result.biderName =
    _.trim(`${result.biderFirstname || ''} ${result.biderLastname || ''}`) ||
    null
  result.biderRateTotal = _.get(product, 'biderInfo.rateTotal', null)
  result.biderRateIncrease = _.get(product, 'biderInfo.rateIncrease', null)
  result.biderRateDecrease = _.get(product, 'biderInfo.rateDecrease', null)

  // seller info
  result.sellerId = _.get(product, 'sellerInfo.id', null)
  result.sellerFirstname = _.get(product, 'sellerInfo.firstName', null)
  result.sellerLastname = _.get(product, 'sellerInfo.lastName', null)
  result.sellerName =
    _.trim(`${result.sellerFirstname || ''} ${result.sellerLastname || ''}`) ||
    null
  result.sellerRateTotal = _.get(product, 'sellerInfo.rateTotal', null)
  result.sellerRateIncrease = _.get(product, 'sellerInfo.rateIncrease', null)
  result.sellerRateDecrease = _.get(product, 'sellerInfo.rateDecrease', null)

  // datetime info
  result.publishedDate = _.get(product, 'publishedDate', null)
  result.expiredDate = _.get(product, 'expiredDate', null)

  if (result.publishedDate)
    result.formatedPublishedDate = moment(result.publishedDate).format(
      'hh:mm - DD/MM/YYYY'
    )

  if (result.expiredDate) {
    const expiredDateMoment = moment(result.expiredDate)
    result.formatedExpiredDate = expiredDateMoment.format('hh:mm - DD/MM/YYYY')
    const [hours, minutes, seconds, parseTime] = calcTimeLeft(
      expiredDateMoment,
      new Date()
    )
    result.formatedTimeLeft = parseTime
    result.hoursLeft = hours
    result.minutesLeft = minutes
    result.secondsLeft = seconds
  }

  return result
}

export function formatProductList(productList) {
  return _.map(productList, formatProductItem) || []
}
