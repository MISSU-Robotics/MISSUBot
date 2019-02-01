module.exports = {
  'log': function (type, content) {
    let message = `[${type.toUpperCase()}] ${content.toLowerCase()}`
    console.log(message)
  }
}
