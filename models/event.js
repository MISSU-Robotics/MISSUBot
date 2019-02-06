const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let eventSchema = mongoose.Schema({
  name: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: new Date()
  },
  creator: ObjectId
})

module.exports = mongoose.model('Event', eventSchema)
