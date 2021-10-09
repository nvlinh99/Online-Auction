const _ = require('lodash')
const CategoryModel = require('../model/category')

exports.getAllCategories = async function () {
  return CategoryModel.find({}).lean()
}

exports.getAllCategoriesHierarchical = async function () {
  const categories = await CategoryModel.find({}).lean()
  const hirearchicalCategories = []
  const childCaregoriesMap = {}
  _.each(categories, (category) => {
    if (!category.parentId) {
      hirearchicalCategories.push(category)
    } else {
      if (!childCaregoriesMap[category.parentId]) {
        childCaregoriesMap[category.parentId] = []
      }
      childCaregoriesMap[category.parentId].push(category)
    }
  })
  
  _.each(hirearchicalCategories, (category) => {
    category.childs = childCaregoriesMap[category.id] || []
  })

  return hirearchicalCategories
}

exports.getCategoriesExpandChilds = async function (categoryId) {
  let categoryIds = null
  if (_.isArray(categoryId)) {
    categoryIds = _.uniq(categoryId)
  } else {
    categoryIds = [categoryId,]
  }
  if (!categoryIds || !categoryIds.length) { return [] }

  const categories = await CategoryModel.find({
    $or: [
      { id: { $in: categoryIds, }, },
      { parentId: { $in: categoryIds, }, },
    ],
  }).lean()

  let flatten = _.flatten(categories)
  flatten = _.uniqBy(flatten, 'id')
  return flatten
}
