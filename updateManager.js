const logger = require('./logger')
const rP = require('request-promise-native')
const semver = require('semver')
const localPackage = require('./package.json')
const { spawn } = require('child_process')

function check (msg) {
  return new Promise(async (resolve, reject) => {
    rP({
      uri: `https://raw.githubusercontent.com/MISSU-Robotics/MISSUBot/master/package.json`,
      transform: function (body) {
        return JSON.parse(body)
      }
    }).then((gitPackage) => {
      if (semver.lt(localPackage.version, gitPackage.version)) {
        if (msg) msg.edit(`Updating to v${gitPackage.version}`)
        resolve(gitPackage)
      } else {
        if (msg) msg.edit(`Already up to date! (v${localPackage.version})`)
        resolve(false)
      }
    })
  })
}

function update (gitPackage, msg) {
  if (process.env.NODE_ENV !== 'production') return
  logger.log('UPDATE', `Updating to v${gitPackage.version}`)
  let updater = spawn('./update.sh')

  updater.on('close', (code) => {
    let finish = () => {
      logger.log('UPDATE', `Updated to v${gitPackage.version}`)
      process.exit(0)
    }
    if (msg) msg.edit(`Updated to v${gitPackage.version}`).then(finish)
    else finish()
  })
}

module.exports = {
  check: (msg) => {
    check(msg).then((gitPackage) => {
      if (!gitPackage) return

      update(gitPackage, msg)
    })
  }
}
