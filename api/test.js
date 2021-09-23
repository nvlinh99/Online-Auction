const joi = require('joi')

console.log(joi.object({ a: joi.any(), }).unknown(false).validate({ b: 2, }))
