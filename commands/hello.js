module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Say hello to the bot'
  }

  this.run = (content, msg) => {
    msg.channel.send(`Hello <@${msg.author.id}>!`)
  }
}
