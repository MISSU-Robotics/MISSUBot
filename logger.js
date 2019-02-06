const config = require('./config')

module.exports = {
  'client': null,
  'setClient': function (botClient) {
    this.client = botClient
  },
  'log': function (type, content) {
    let message = `**[${type.toUpperCase()}]** ${content.toLowerCase()}`
    console.log(message)
    if (this.client) this.client.channels.get(config.channels.commandLog).send(message)
  }
}
