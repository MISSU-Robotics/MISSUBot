const autoupdater = require('../updateManager')

module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Update the bot',
    hide: true
  }

  this.run = (content, msg) => {
    msg.channel.send('Checking...').then((newMsg) => {
      autoupdater.check(newMsg)
    })
  }
}
