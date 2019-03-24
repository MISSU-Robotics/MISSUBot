const config = require('./config')

module.exports = {
  client: null,
  setClient: function (botClient) {
    this.client = botClient
  },
  log: function (type, content) {
    console.log(`[${type.toUpperCase()}] ${content.toLowerCase()}`)
    if (this.client) {
      this.client.channels
        .get(config.channels.commandLog)
        .send(`**[${type.toUpperCase()}]** ${content.toLowerCase()}`)
    }
  }
}
