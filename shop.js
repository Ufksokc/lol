const db = require('quick.db')
const discord = require('discord.js')

module.exports = {
    name: 'shop',
    description: 'display the shop',
    aliases: ['s'],
    cooldown: 3,
    execute(message) {
        const profile = new db.table('profiles')

        const member = message.author.id

        const ticket = profile.get(`profiles_${member}.bought.ticket`)
        const goldenticket = profile.get(`profiles_${member}.bought.goldenticket`)
        const diamondticket = profile.get(`profiles_${member}.bought.dimaondticket`)
        const superticket = profile.get(`profiles_${member}.bought.superticket`)

        return message.channel.send(new discord.MessageEmbed()
        .setColor('BLUE')
        .setDescription(`
Ticket - GU ${(ticket * 10 + 10 ||'10').toLocaleString()} - 1 GU / 60s
${ticket > 10 ? `Golden Ticket - GU${(goldenticket * 25 + 25 || '25').toLocaleString()} - 2 GU / 50s` : ''}
${goldenticket > 25 ? `Diamond Ticket - GU${(diamondticket * 50 + 50 || '50').toLocaleString()} - 4 GU / 60s` : ''}
        `)
        )
    }
}