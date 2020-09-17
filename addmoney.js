const db = require('quick.db')

const discord = require('discord.js')

module.exports = {
    name: 'addmoney',
    description: 'add a money to the mentioned user',
    aliases: 'addm',
    cooldown: 3,
    execute(message, args) {
        if(!message.author.id == '702457675887280198') {
            message.channel.send('You cant use this command!')
        }

        
        const profiles = new db.table('profiles')

        const member = message.mentions.members.first() || message.member
        
        const memberProfile = profiles.get(`profiles_${member.id}`)

        if (!memberProfile) return message.channel.send("This member dont have a profile.")

        if (!args[1]) return message.channel.send("Please specify someone to add money.")

        if(isNaN(args[1]) || args[1] < 0) return message.channel.send("I cant add this number.")

        profiles.add(`profiles_${member.id}.money`, parseInt(args[1]))

        return message.channel.send(`Added ${args[1].toLocaleString()}GU to ${member}`)
    }
}