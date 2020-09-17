const db = require('quick.db')

module.exports = {
    name: 'removemoney',
    description: 'remove money to the mentioned user',
    aliases: 'removem',
    cooldown: 3,
    execute(message, args) {
        if(!message.author.id == '702457675887280198') {
            message.channel.send('You cant use this command!')
        }

        const profiles = new db.table('profiles')

        const member = message.mentions.members.first() || message.member

        const memberProfile = profiles.get(`profiles_${member.id}`)

        if(!memberProfile) return message.channel.send('This member dont have a profile.')
        if(!args[1]) return message.channel.send('You need to specify someone to remove money.')
        if(isNaN(args[1]) || args[1] < 0) return message.channel.send('You need to specify a number above 0')

        const oldBal = profiles.get(`profiles_${member.id}.money`)

        if(oldBal - args[1] < 0) return message.channel.send('I cant remove this money because the balance will go below 0')

        profiles.substract(`profiles_${member.id}.money`, args[1])

        return message.channel.send(`Removed ${args[1].toLocaleString()}GU from ${member}`)
    }
}