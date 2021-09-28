const joi = require('joi')
const _ = require('lodash')

const o = {}
o.a = 1
o.b = 2 
console.log(o)
delete o.a
o.a = 1
console.log(o)
