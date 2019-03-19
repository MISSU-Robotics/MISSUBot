const Discord = require('discord.js')
const client = new Discord.Client()
const mongoose = require('mongoose')

const Commander = new (require('./commander'))(client)
const EventManager = require('./eventManager')
const logger = require('./logger')

const User = require('./models/user')

const config = require('./config')
const secrets = require('./secrets')

mongoose.connect(secrets.mongodb.uri, { useNewUrlParser: true })
mongoose.set('useFindAndModify', false)

client.on('message', (msg) => {
  if (msg.author.bot) return

  if (msg.content.startsWith(config.prefix)) {
    if (Commander.runCommand(msg) === 0) {
      msg.reply(
        `Command not found! Try ${
          config.prefix
        }help to learn about the commands!`
      )
    }
  }
})

client.on('guildMemberAdd', (member) => {
  if (member.user.bot) return

  User.findOneAndUpdate(
    { discordID: member.user.id },
    { discordID: member.user.id },
    { upsert: true },
    (err) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)
    }
  )
})

client.on('presenceUpdate', (member) => {
  if (member.user.bot) return

  User.findOneAndUpdate(
    { discordID: member.user.id },
    { discordID: member.user.id },
    { upsert: true },
    (err) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)
    }
  )
})

logger.log('BOT', 'attempting to log in')

client.login(secrets.bot).then(() => {
  logger.setClient(client)
  logger.log('BOT', 'logged in')

  EventManager.setClient(client)
  EventManager.init()
})
