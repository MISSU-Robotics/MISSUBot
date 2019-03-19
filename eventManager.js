const Event = require('./models/event')
const User = require('./models/user')

const logger = require('./logger')

const config = require('./config')

module.exports = {
  client: null,
  setClient: function (botClient) {
    this.client = botClient
  },
  init: function () {
    Event.find({}, (err, events) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)

      events.forEach((event) => {
        if (!this.addEvent(event)) {
          Event.findOneAndDelete({ _id: event._id }, (err) => {
            if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)
          })
        }
      })
    })
  },
  addEvent: function (event) {
    if (event.date - Date.now() < 0) return false

    this.eventTimeouts[event._id] = setTimeout(() => {
      this.client.channels
        .get(config.channels.events)
        .send(`@everyone It is ${event.name} time!`)
      logger.log('EVENT', event.name.toLowerCase())
      this.removeEvent(event._id)
    }, event.date - Date.now())

    return true
  },
  removeEvent: function (eventID) {
    clearTimeout(this.eventTimeouts[eventID])
    this.eventTimeouts[eventID] = null

    Event.findById(eventID, (err, event) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)

      User.findById(event.creator, (err, user) => {
        if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)

        let index = user.events.indexOf(eventID)

        if (index > -1) {
          user.events.splice(index, 1)
        }

        user.save()
      })
    })

    Event.findByIdAndDelete(eventID, (err) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)
    })
  },
  eventTimeouts: {}
}
