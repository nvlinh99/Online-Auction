const Category = require('../../model/category')

const getPagination = (page, limit) => {
  const size = limit ? +limit : 10
  const offset = page ? page * limit : 0
  return { size, offset, }
}

exports.getAllCategories = async (req, res, next) => {
  const { page, limit, } = req.query
  const { size, offset, } = getPagination(page, limit)
  await Category.paginate({}, { offset, size, })
    .then((data) => {
      res.status(200).json({
        code: 1000,
        totalItems: data.totalDocs,
        items: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      })
    })
    .catch((err) => {
      res.status(500).send({
        code: -1000,
        message: 'Đã xảy ra một số lỗi khi truy xuất',
      })
    })
}

exports.getCategory = async (req, res, next) => {
  const { id, } = req.params

  const category = await Category.findOne({ id, })

  if (!category) {
    return res.status(404).json({
      code: -1000,
      message: 'Không tìm thấy loại này!',
    })
  }

  return res.status(200).json({
    code: 1000,
    data: category,
  })
}
