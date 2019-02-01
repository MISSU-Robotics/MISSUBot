const logger = require('../logger')

module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Check the latency of the bot'
  }

  this.run = (content, msg) => {
    let ping = new Date().getTime() - msg.createdTimestamp

    msg.channel.send(`*Pong!* ${ping}ms`)

    logger.log('PING', `current ping ${ping}ms`)
  }
}
