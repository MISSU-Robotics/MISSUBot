module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Check the date'
  }

  this.run = (content, msg) => {
    msg.reply(`It is currently ${new Date().toLocaleDateString()}`)
  }
}
