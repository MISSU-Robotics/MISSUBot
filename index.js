const secrets = require('./secrets')

const Discord = require('discord.js')
const client = new Discord.Client()

const Commander = new (require('./commander'))(client)
const logger = require('./logger')

const config = require('./config')

client.on('message', (msg) => {
  if (msg.author.bot) return

  if (msg.content.startsWith(config.prefix)) {
    if (Commander.runCommand(msg) === 0) msg.reply(`Command not found! Try ${config.prefix}help to learn about the commands!`)
  }
})

logger.log('BOT', 'attempting to log in')
client.login(secrets.bot)
logger.log('BOT', 'logged in')
