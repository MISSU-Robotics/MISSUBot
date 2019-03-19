const AutoUpdater = require('auto-updater')

const logger = require('../logger')

const autoupdater = new AutoUpdater({
  pathToJson: '',
  autoupdate: true,
  checkgit: true,
  jsonhost: 'raw.githubusercontent.com',
  contenthost: 'codeload.github.com',
  progressDebounce: 0,
  devmode: false
})

let message = null

module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Update the bot'
  }

  this.run = (content, msg) => {
    message = msg
    autoupdater.fire('check')
  }
}

autoupdater.on('check.up-to-date', function (v) {
  message.reply('Already up to date!')
})

autoupdater.on('check.out-dated', function (vOld, v) {
  message.reply(`Updating to v${v}!`)
  logger.log('UPDATE', `updating to v${v}!`)
})

autoupdater.on('update.extracted', function () {
  logger.log('UPDATE', 'restarting to uptate')
  process.exit(1)
})
