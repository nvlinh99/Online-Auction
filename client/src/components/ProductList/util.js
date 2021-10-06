import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'

export function calcTimeLeft(t1, t2) {
  t1 = moment(t1)
  t2 = moment(t2)
  const duration = moment.duration(t1.diff(t2))
  const hours = duration.hours()
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
  result.id = _.get(product, 'id', null)
  result.avatarUrl = _.get(product, 'avatarUrl', null)
  result.title = _.get(product, 'title')
  result.currentPrice = _.get(product, 'currentPrice', null)
  result.purchasePrice = _.get(product, 'purchasePrice', null)
  result.publishedDate = _.get(product, 'publishedDate', null)
  result.expiredDate = _.get(product, 'expiredDate', null)
  result.totalBid = _.get(product, 'totalBid', null)

  if (result.currentPrice)
    result.formatedCurrentPrice = numeral(result.currentPrice).format(0, 0)

  if (result.purchasePrice)
    result.formatedPurchasePrice = numeral(result.purchasePrice).format(0, 0)

  if (result.publishedDate)
    result.formatedPublishedDate = moment(result.publishedDate).format(
      'hh:mm DD/MM/YYYY'
    )

  if (result.expiredDate) {
    const expiredDateMoment = moment(result.expiredDate)
    result.formatedExpiredDate = expiredDateMoment.format('hh:mm DD/MM/YYYY')
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
