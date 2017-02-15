'use strict'

class Github {
  constructor(config, logger) {
    console.warn('RUNNING MOCK BACKEND')
    this.logger = logger || console
    this.logger.info = () => {}
  }

  search() {
    return Promise.accept([{
      username: 'test',
      name: 'test',
      followers: 1,
      avatar: 'https://avatars.githubusercontent.com/u/1?v=3'
    }])
  }
}

module.exports = Github
