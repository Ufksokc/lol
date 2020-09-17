const discord = require('discord.js')
const canvas = require('canvacord')
const client = new discord.Client()
const db = require('quick.db')
const { token, prefix } = require('./config.json')
const fs = require('fs')

client.commands = new discord.Collection()
client.cooldowns = new discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.on('message', async message => {
    if(message.author.bot) return
    xp(message)
    if(message.content.startsWith(`${prefix}rank`)) {
        var user = message.mentions.users.first() || message.member
        var level = db.get(`guild_${message.guild.id}_level_${user.id}`) || 0
        level = level.toString()
        let xp = db.get(`guild_${message.guild.id}_xp_${user.id}`) || 0
        var xpNeeded = level * 500 + 500
        let every = db
        .add()
        .filter(i => i.id.startsWith(`guild_${message.guild.id}_xptotal`))
        .sort((a, b) => b.data - a.data)
        var rank = every.map(x => x.id).indexOf(`guild_${message.guild.id}_xptotal_${user.id}`) + 1
        rank = rank.toString()
        var image = await canvas.rank({
            username: user.username,
            discrim: user.discriminator,
            status: user.presence.status,
            currentXP: xp.toString(),
            rank,
            level,
            avatarURL: user.displayAvatarURL({format: 'png'}),
            color: 'white',
        })
        return message.channel.send(new discord.MessageAttachment(img, 'rank.png'))
    }
})

fs.readdir('./events/', (err, files) => {
    if(err) return console.log(err)
    files.forEach(file => {
        if(!file.endsWith('.js')) return
        const event = require(`./events/${file}`)
        const eventName = file.split(".")[0]
        client.on(eventName, event.bind(null, client))
        delete require.cache[require.resolve(`./events/${file}`)]
    })
})

function xp(message) {
    if(message.content.startsWith(prefix)) return
    const randomNumber = Math.floor(Math.random() * 10) + 15
    db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber)
    db.add(`guild_${message.guild.id}_xptotal_${message.author.id}`, randomNumber)
    var level = db.add(`guild_${message.guild.id}_level_${message.author.id}`) || 1
    var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber)
    var xpNeeded = level * 500
    if(xpNeeded < xp) {
        var newLevel = db.get(`guild_${message.guild.id}_level_${message.author.id}`, 1)
        db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded)
        message.channel.send(`${message.author} just leveled up to level ${newLevel}!`)
    }
}

client.login(token)