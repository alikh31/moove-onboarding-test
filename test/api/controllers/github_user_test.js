'use strict'

require('should')
const request = require('supertest')

describe('validate route', function() {
  let server

  before(function() {
    const appname = require('../../../package').name
    const config = require('rc')(appname, {})
    const Github = require('../../../api/mocks/github')
    server = require('../../../app')(config, {
      logger: console,
      github: new Github(config)
    })
  })

  describe('GET /github_user', function() {
    it('should get response', function(done) {
      request(server)
      .get('/search/github_user?in=email&q=ali&language=javascript')
      .end(function(err, res) {
        res.status.should.eql(200)
        done(err)
      })
    })
  })
})
