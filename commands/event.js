const Discord = require('discord.js')
const chrono = require('chrono-node')
const stringSimilarity = require('string-similarity')

const EventManager = require('../eventManager')
const logger = require('../logger')

const Event = require('../models/event')
const User = require('../models/user')

module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Create / view an event'
  }

  this.run = (content, msg) => {
    let action = content.shift()
    switch (action) {
      case 'create':
        createEvent(content, msg)
        break
      case 'view':
        viewEvent(content, msg)
        break
      case 'delete':
        deleteEvent(content, msg)
        break
      case undefined:
        msg.channel.send('Possible actions are:\n`create, view, delete`')
        break
      default:
        msg.channel.send(`Event action "${action}" not found`)
    }
  }
}

function createEvent (content, msg) {
  let text = content.join(' ')

  let ev = chrono.parse(text)

  let event = new Event()

  event.name = text.substring(0, text.length - ev[0].text.length - 1)
  event.date = ev[0].start.date()

  User.findOne({ discordID: msg.author.id }, (err, user) => {
    if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)

    event.creator = user._id

    event.save((err, event) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)

      msg.reply('Event created!')

      EventManager.addEvent(event)
    })

    user.events.push(event._id)

    user.save((err, event) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)
    })
  })
}

function viewEvent (content, msg) {
  Event.find({}, (err, events) => {
    if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)

    let eventNames = []

    events.forEach((event) => {
      eventNames.push(event.name)
    })

    let i = stringSimilarity.findBestMatch(content.join(' '), eventNames)
      .bestMatchIndex

    if (events[i]) msg.channel.send(createEventRichEmbed(events[i]))
    else msg.reply('Event not found!')
  })
}

function deleteEvent (content, msg) {
  User.findOne({ discordID: msg.author.id }, (err, user) => {
    if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)
    Event.find({ creator: user._id }, (err, events) => {
      if (err) logger.log('ERROR', `\`\`\`${err}\`\`\``)

      let eventNames = []

      events.forEach((event) => {
        eventNames.push(event.name)
      })

      let i = stringSimilarity.findBestMatch(content.join(' '), eventNames)
        .bestMatchIndex

      if (events[i]) {
        EventManager.removeEvent(events[i]._id)
        msg.reply('Event removed!')
      } else {
        msg.reply('Event not found!')
      }
    })
  })
}

function createEventRichEmbed (event) {
  let eventEmbed = new Discord.RichEmbed().setTitle(`**${event.name}**`)

  eventEmbed.addField('Date', event.date.toDateString(), true)
  eventEmbed.addField('Time', event.date.toTimeString(), true)

  return eventEmbed
}
