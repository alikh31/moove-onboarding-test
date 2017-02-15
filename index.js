'use strict'

const appname = require('./package').name
const config = require('rc')(appname, {})
const logger = console
const Github = config.mockbackend ?
  require('./api/mocks/github') :
  require('./api/helpers/github')

const server = require('./app')(config, {
  logger,
  github: new Github(config)
})
server.listen(config.appPort)
logger.info('server has started on port ' + config.appPort)
