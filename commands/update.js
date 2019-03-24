const autoupdater = require('../autoUpdate')

module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Update the bot',
    hide: true
  }

  this.run = (content, msg) => {
    autoupdater.check()
  }
}
