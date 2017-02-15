'use strict'

module.exports = function(dependencies) {
  const github = dependencies.github
  return {
    search: function(req, res, next) {
      github.search({
        query: req.swagger.params.q.value,
        language: req.swagger.params.language.value,
        type: req.swagger.params.in.value
      })
      .then(r => {
        res.status(200)
        .json(r)
      })
      .catch(e => {
        res.status(500)
        .type('plain/text')
        .send(new Buffer('internal server problem'))
      })
    }
  }
}
