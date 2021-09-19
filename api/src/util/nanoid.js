const nanoid = require('nanoid')
const nanoidDictionary = require('nanoid-dictionary')

const functions = {}

exports.getGenFunction = function (alphabet = 'numbers', size = 10) {
  const functionKey = alphabet + size
  let gen = functions[functionKey]
  if (!gen) {
    gen = nanoid.customAlphabet(nanoidDictionary[alphabet], size)
    functions[functionKey] = gen
  }

  return gen
}

exports.generate = function (alphabet = 'numbers', size = 10) {
  const gen = exports.getGenFunction(alphabet, size)
  return gen()
}
