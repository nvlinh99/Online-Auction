const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})
Number.prototype.toCurrency = function () {
  return formatter.format(this)
}
