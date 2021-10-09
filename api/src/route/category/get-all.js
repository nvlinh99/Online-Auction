const joi = require('joi')
const md5 = require('md5')
const CategoryModel = require('../../model/category')
const CategoryService = require('../../service/category-service')
const configuration = require('../../configuration')
const genRequestValidation = require('../../middleware/gen-request-validation')

const requestValidationHandler = genRequestValidation({
  query: joi
    .object({
      hierarchical: joi.string().valid('true', 'false'),
    })
    .unknown(false),
})

const getAllCategoriesHandler = async (req, res) => {
  let categories = null
  if (req.query.hierarchical === 'true') {
    categories = await CategoryService.getAllCategoriesHierarchical()
  } else {
    categories = await CategoryService.getAllCategories()
  }

  return res.json({
    code: 1000,
    data: {
      categories: categories || [],
    },
  })
}

module.exports = [
  requestValidationHandler,
  getAllCategoriesHandler,
]
