const fs = require('fs')
const Discord = require('discord.js')
const logger = require('./logger')

const config = require('./config')

module.exports = class Commander {
  constructor (client) {
    this.client = client

    this.commandScripts = {}

    this.helpInfo = {}

    fs.readdirSync(`${__dirname}/commands`, { 'encoding': 'utf8' }).forEach((fileName) => {
      if (fileName.endsWith('.js')) {
        let command = new (require(`./commands/${fileName}`))(client)

        if (!this.helpInfo[command.info.category]) this.helpInfo[command.info.category] = []

        this.helpInfo[command.info.category].push({
          name: fileName.substring(0, fileName.length - 3).toLowerCase(),
          description: command.info.description
        })

        this.commandScripts[fileName.substring(0, fileName.length - 3).toLowerCase()] = command

        logger.log('COMMAND', `loaded ${fileName}`)
      }
    })
  }

  sendHelp (channel) {
    let helpEmbed = new Discord.RichEmbed().setTitle('**Help**').setFooter(`#${channel.name}`).setColor(16729344)

    Object.keys(this.helpInfo).forEach((key) => {
      let category = ''

      this.helpInfo[key].forEach((cmd) => {
        category += `${config.prefix + cmd.name}  -  ${cmd.description}\n`
      })

      helpEmbed.addField(key, category.substring(0, category.length - 1))
    })

    channel.send(helpEmbed)
  }

  runCommand (msg) {
    let msgSplit = msg.content.split(' ')

    let command = msgSplit.shift().trim().substr(1).toLowerCase()

    if (command === 'help') {
      this.sendHelp(msg.channel)
      return 1
    }

    if (!this.commandScripts[command]) return 0

    let content = msgSplit

    this.commandScripts[command].run(content, msg)

    return 1
  }
}
