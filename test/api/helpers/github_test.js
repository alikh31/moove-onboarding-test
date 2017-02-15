'use strict'

require('should')
const pkgInfo = require('../../../package.json')
const config = require('rc')(pkgInfo.name, {})
const nock = require('nock')
const mockAPI = nock(config.apiUrl)
const jsUsers = require('../../assets/js-users.json')
const usersInfos = require('../../assets/user-infos.json')

describe('Basic functionality', function() {
  let Github

  before(function() {
    Github = require('../../../api/helpers/github')
  })

  it('should get users from github api', function(done) {
    mockAPI.get(/\/search\/users.*/)
    .reply(200, jsUsers)

    const github = new Github(config)
    github._searchUsers('tom', 'javascript', 'fullname')
    .then(res => {
      res.length.should.eql(3)
      done()
    })
    .catch(e => done(e))
  })

  it('should handle 400 response for get users', function(done) {
    mockAPI.get(/\/search\/users.*/)
    .reply(400, '')

    const github = new Github(config)
    github._searchUsers('tom', 'javascript', 'fullname')
    .catch(e => {
      done()
    })
  })

  it('should get an specific user score', function(done) {
    const user = 'https://api.github.com/users/tmcw'
    mockAPI.get(/\/users.*/)
    .reply(200, usersInfos['/users/tmcw'])

    const github = new Github(config)
    github._getUserInfo(user)
    .then(info => {
      info.avatar.should.eql('https://avatars.githubusercontent.com/u/32314?v=3')
      info.followers.should.eql(1574)
      info.name.should.eql('Tom MacWright')
      info.username.should.eql('tmcw')
      done()
    })
    .catch(e => done(e))
  })

  it('should return correct formating search result', function(done) {
    mockAPI.get(/\/search\/users.*/)
    .reply(200, jsUsers)

    mockAPI.get(/\/users\/.*/)
    .times(3)
    .reply(200, function(uri, requestBody) {
      return usersInfos[uri]
    })

    const github = new Github(config)
    github.search({
      query: 'top',
      language: 'javascript',
      type: 'fullname'
    })
    .then(res => {
      res.length.should.eql(3)
      done()
    })
    .catch(e => done(e))
  })
})
