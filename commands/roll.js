let diceTest = /d(\d*)x(\d*)/

module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Roll a dice'
  }

  this.run = (content, msg) => {
    let total = 0
    let string = 'You rolled dice!\n'

    let invalid = false

    if (content.length === 0) {
      msg.reply(`Try \`!roll d20x3\`!`)
      return
    }

    content.forEach((dice) => {
      let diceLine = `\n${dice}: (`
      let diceTotal = 0
      let out = diceTest.exec(dice)

      if (!out) {
        msg.reply(`Invalid dice \`${dice}\`, use format d(faces)x(count). e.g. \`d20x3\``)
        invalid = true
        return
      }

      let sides = out[1]
      let diceCount = out[2]

      for (let i = 0; i < diceCount; i++) {
        let val = Math.ceil(Math.random() * sides)

        diceLine += `${val} + `

        diceTotal += val
        total += val
      }

      string += `${diceLine.substring(0, diceLine.length - 3)}) = ${diceTotal}`
    })

    if (invalid) return

    string += `\n\nTotal value: ${total}`

    msg.reply(string)
  }
}
