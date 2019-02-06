const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let userSchema = mongoose.Schema({
  discordID: String,
  events: [ObjectId]
})

module.exports = mongoose.model('User', userSchema)
