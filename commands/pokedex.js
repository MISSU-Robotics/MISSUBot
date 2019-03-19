const { RichEmbed } = require('discord.js')
const toHex = require('colornames')
const pokemon = require('pokemon')
const pokemonGif = require('pokemon-gif')
const rP = require('request-promise-native')

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
        getGIF(content, msg)
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
  if (isNaN(pokemonVal)) return pokemon.getId(pokemonVal)
  return pokemonVal
}

function getPokeInfo (id) {
  return rP({
    uri: `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
    transform: function (body) {
      return JSON.parse(body)
    }
  })
}

// function getExtraPokeInfo (id) {
//   return rP({
//     uri: `https://pokeapi.co/api/v2/pokemon/${id}/`,
//     transform: function (body) {
//       return JSON.parse(body)
//     }
//   })
// }

function getGIF (content, msg) {
  let pokemonVal = content.join('')
  msg.reply(pokemonGif(isNaN(pokemonVal) ? pokemonVal : parseInt(pokemonVal)))
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
  msg.channel.send('Please wait...').then((newMsg) => {
    getPokeInfo(id).then((pokeInfo) => {
      // getExtraPokeInfo(id).then((extraPokeInfo) => {
      let embed = new RichEmbed()
        .setAuthor(`#${pokeInfo.id} - ${uCFirst(pokeInfo.name)}`)
        .setTitle(findByLanguage(pokeInfo.genera).genus)
        .setFooter(findByLanguage(pokeInfo.flavor_text_entries).flavor_text)
        .setImage(pokemonGif(pokeInfo.id))
        .setColor(outColor(pokeInfo.color.name))
      newMsg.edit(embed)
      // })
    })
  })
}

function uCFirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
