const { RichEmbed } = require('discord.js')
const toHex = require('colornames')
const pokemon = require('pokemon')
const rP = require('request-promise-native')
const stringSimilarity = require('string-similarity')

const pokeList = pokemon.all()

module.exports = function (client) {
  this.client = client

  this.info = {
    category: 'General',
    description: 'Browse the pokedex'
  }

  this.run = (content, msg) => {
    let action = content.shift()
    switch (action) {
      case 'gif':
        sendGIF(content, msg)
        break
      case undefined:
        msg.channel.send("I DON'T KNOW WHAT TO DO WITH THAT INFORMATION!!!")
        break
      case 'search':
        searchPokedex(content, msg)
        break
      default:
        searchPokedex([action], msg)
        break
    }
  }
}

function getPokeID (pokemonVal) {
  let val
  if (isNaN(pokemonVal)) {
    let similarity = stringSimilarity.findBestMatch(
      uCFirst(pokemonVal),
      pokeList
    )
    console.log(similarity.bestMatch)
    if (similarity.bestMatch.rating < 0.75) return 'Invalid Pokémon name!'
    val = similarity.bestMatchIndex + 1
  } else {
    val = parseInt(pokemonVal)
    if (val <= 0 || val > pokeList.length) return 'Invalid Pokémon id!'
  }

  return val
}

function getPokeInfo (id) {
  return rP({
    uri: `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
    transform: function (body) {
      return JSON.parse(body)
    }
  })
}

function getGIF (id) {
  let name = pokeList[id - 1].toLowerCase()
  return `http://play.pokemonshowdown.com/sprites/xyani/${name}.gif`
}

function sendGIF (content, msg) {
  let id = getPokeID(content.join(''))
  if (isNaN(id)) {
    msg.channel.send(id)
    return
  }
  msg.reply(getGIF(id))
}

function findByLanguage (object, lang = 'en') {
  return Object.values(object).find((val) => {
    return lang === val.language.name
  })
}

function outColor (name) {
  return `0x${toHex(name).slice(0)}`
}

function searchPokedex (content, msg) {
  let id = getPokeID(content.join(''))
  if (isNaN(id)) {
    msg.channel.send(id)
    return
  }
  msg.channel.send('Please wait...').then((newMsg) => {
    getPokeInfo(id).then((pokeInfo) => {
      let embed = new RichEmbed()
        .setAuthor(`#${pokeInfo.id} - ${uCFirst(pokeInfo.name)}`)
        .setTitle(findByLanguage(pokeInfo.genera).genus)
        .setFooter(findByLanguage(pokeInfo.flavor_text_entries).flavor_text)
        .setImage(getGIF(pokeInfo.id))
        .setColor(outColor(pokeInfo.color.name))
      newMsg.edit(embed)
    })
  })
}

function uCFirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
