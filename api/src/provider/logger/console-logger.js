const Moment = require('moment')

const INFO_TAG = 'INFO'
const WARN_TAG = 'WARN'
const ERROR_TAG = 'ERROR'

const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORAMT = 'hh:mm:ss'

const TAG_FIXED_LENGTH = 8
const SCOPE_FIXED_LENGTH = 10
const EXTENDED_TAG_STR = ' '
const EXTENDED_SCOPE_STR = ' '

function getLogLinePrefix() {
  const now = Moment()

  const dateAsString = now.format(DATE_FORMAT)
  const timeAsString = now.format(TIME_FORAMT)
  const prefix = `[${dateAsString} ${timeAsString}]`
  return prefix
}

function addLog(tag, scope, text) {
  const linePrefix = getLogLinePrefix()

  const extendedTagLength = Math.max(TAG_FIXED_LENGTH - tag.length, 0)
  const extendedScopeLength = Math.max(SCOPE_FIXED_LENGTH - scope.length, 0)

  const extendedTag = EXTENDED_TAG_STR.repeat(extendedTagLength)
  const extendedScope = EXTENDED_SCOPE_STR.repeat(extendedScopeLength)
  // eslint-disable-next-line no-console
  console.log(`${linePrefix}  [${tag}]${extendedTag}[${scope}]${extendedScope} ${text}`)
}

function info(text) {
  return addLog(INFO_TAG, this.scope, text)
}

function warn(text) {
  return addLog(WARN_TAG, this.scope, text)
}

function error(text) {
  return addLog(ERROR_TAG, this.scope, text)
}

function getLogger(scope) {
  const instance = {
    scope,
    info,
    warn,
    error,
  }

  return instance
}

module.exports = {
  getLogger,
}
