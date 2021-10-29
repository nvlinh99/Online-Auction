const { Router } = require('express')
const getController = require('./get-tran')
const authHandler = require('../../middleware/auth')

exports.path = '/transactions'

const tranRouter = Router()

tranRouter.get('/', getController)

exports.router = tranRouter
