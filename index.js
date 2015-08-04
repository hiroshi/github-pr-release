var fs = require('fs')

var releaseMessage = require('./lib/release-message.js')
var GithubClient = require('./lib/github-client.js')

module.exports = function createReleasePR (config) {
  var client = new GithubClient(config)

  return client.prepareReleasePR().then(function (releasePR) {
    if (!releasePR) {
      return null
    }
    return client.collectReleasePRs(releasePR).then(function (prs) {
      var template = fs.readFileSync(__dirname + '/release.mustache', 'utf8')
      var message = releaseMessage(template, prs)

      return client.updatePR(releasePR, message)
    })
  })
}
