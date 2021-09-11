const moment = require('moment')
const path = require('path')
const fs = require('fs')

const logDir = path.join(__dirname, '../../.logs')
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

const INFO_TAG = 'INFO'
const WARN_TAG = 'WARN'
const ERROR_TAG = 'ERROR'

const DATE_FORMAT = 'YYYY-MM-DD'
const TIME_FORAMT = 'hh:mm:ss'

const TAG_FIXED_LENGTH = 8
const SCOPE_FIXED_LENGTH = 10
const EXTENDED_TAG_STR = ' '
const EXTENDED_SCOPE_STR = ' '

function getFileNameAndLogLinePrefix() {
  const now = moment()

  const dateAsString = now.format(DATE_FORMAT)
  const timeAsString = now.format(TIME_FORAMT)
  const filenName = `${dateAsString}.log`
  const prefix = `[${dateAsString} ${timeAsString}]`
  return [filenName, prefix,]
}

function addLog(tag, scope, text) {
  const [fileName, linePrefix,] = getFileNameAndLogLinePrefix()

  const extendedTagLength = Math.max(TAG_FIXED_LENGTH - tag.length, 0)
  const extendedScopeLength = Math.max(SCOPE_FIXED_LENGTH - scope.length, 0)

  const extendedTag = EXTENDED_TAG_STR.repeat(extendedTagLength)
  const extendedScope = EXTENDED_SCOPE_STR.repeat(extendedScopeLength)
  // eslint-disable-next-line no-console
  fs.open(`${logDir}/${fileName}`, 'a', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // Append to file and close it
      fs.appendFile(fileDescriptor, `${linePrefix}  [${tag}]${extendedTag}[${scope}]${extendedScope} ${text}\n`, (_err) => {
        if (!_err) {
          fs.close(fileDescriptor, (__err) => {
            if (!__err) {
              return true
            }
            // eslint-disable-next-line no-console
            return console.log('\x1b[31m%s\x1b[0m', 'Error closing log file that was being appended')
          })
        } else {
          // eslint-disable-next-line no-console
          return console.log('\x1b[31m%s\x1b[0m', 'Error appending to the log file')
        }
      })
    } else {
      // eslint-disable-next-line no-console
      return console.log('\x1b[31m%s\x1b[0m', 'Error cloudn\'t open the log file for appending')
    }
  })
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

module.exports.getLogger = function (scope) {
  const instance = {
    scope,
    info,
    warn,
    error,
  }

  return instance
}
