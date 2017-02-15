'use strict'
const rp = require('request-promise')
const url = require('url')
const async = require('async')

/**
 * Github api wrapper as a class, to encapsulate the code and help for unit testing
 */
class Github {

  /**
   * @param {object} config containing api url as string
   * @param {object} logger default logger to be used
   */
  constructor(config, logger) {
    this.logger = logger || console
    this.logger.info = () => {}
    this.apiUrl = config.apiUrl
  }

  /**
   * @return {promise} searched github api for the user base on the language
   * returns structured users
   * @param {string} query query parameter specified by type of query
   * @param {string} language string
   * @param {string} type type of query one of fullname, email, login
   * if rejected passes the specified error.
   */
  _searchUsers(query, language, type) {
    return new Promise((accept, reject) => {
      const q = `${query}+language:${language}+in:${type}+type:user`
      const endpoint = `search/users?q=${q}`

      this.logger.info(`sending search request to ${endpoint}`)
      rp({
        uri: url.resolve(this.apiUrl, endpoint),
        headers: {'User-Agent': 'node'},
        json: true
      })
      .then(res => {
        this.logger.info(`response back for ${endpoint}
  got ${JSON.stringify(res.items.length)} users`)
        accept(res.items)
      })
      .catch(e => {
        this.logger.info(`rejected response for ${endpoint}`, JSON.stringify(e))
        reject(e)
      })
    })
  }

  /**
   * gets all the information of an specified user from it's url
   * @param {string} userUrl url to user informtion
   * @return {promise} if accepted passes all informtion about a user,
   * if rejected passes the specified error.
   */
  _getUserInfo(userUrl) {
    return new Promise((accept, reject) => {
      this.logger.info(`sending user info request to ${userUrl}`)
      rp({
        uri: userUrl,
        headers: {'User-Agent': 'node'},
        json: true
      })
      .then(res => {
        this.logger.info(`response back for ${userUrl}`)
        const ret = {
          username: res.login,
          name: res.name,
          followers: res.followers,
          avatar: res.avatar_url
        }

        accept(ret)
      })
      .catch(e => {
        this.logger.info(`git error back for ${userUrl}`, e)
        reject(e)
      })
    })
  }

  /**
   * runner function
   * @param {object} opts option to search the users with, containing:
   *      - query parameter specified by type of query
   *      - language in their public repositories
   *      - type of query one of fullname, email, login
   * @return {promise} if accepted passes all users from search query in correct structured,
   * if rejected passes the specified error.
   */
  search(opts) {
    return new Promise((accept, reject) => {
      this._searchUsers(opts.query, opts.language, opts.type)
      .then(users => {
        const result = []
        const q = async.queue((url, callback) => {
          this._getUserInfo(url)
          .then(res => {
            result.push(res)
            callback()
          })
          .catch(e => callback(e))
        }, 1)

        users.forEach(u => q.push(u.url))
        q.drain = () => {
          accept(result)
        }
      })
      .catch(e => reject(e))
    })
  }
}

module.exports = Github
