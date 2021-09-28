const { Router, } = require('express')
const getAllCategoriesController = require('./get-all')

exports.path = '/categories'

const categoryRouter = Router()
categoryRouter.get('/', getAllCategoriesController)

exports.router = categoryRouter
