const config = require('./config')

let client

module.exports = {
  'setClient': function setClient (botClient) {
    client = botClient
  },
  'log': function (type, content) {
    let message = `**[${type.toUpperCase()}]** ${content.toLowerCase()}`
    console.log(message)
    if (client) client.channels.get(config.channels.commandLog).send(message)
  }
}
