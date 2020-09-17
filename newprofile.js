const { ReactionUserManager } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'newprofile',
    description: 'create a new profile',
    aliases: ['newp'],
    cooldown: 3, 
    execute(message) {
        const profiles = new db.table('profiles')

        const userProfile = profiles.get(`profiles_${message.author.id}`)

        if(userProfile) return message.channel.send('You already have a profile.')

        message.channel.send('Send a message of your profile name')

        const filter = (user) => {
            return user.author.id == message.author.id
        }

        message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const name = collected.first().content
            const regex = !/[^a-zA-Z0-9 ]+/g.test(name)

            if(!regex) return message.channel.send('Your username can only contains letter and number')

            profiles.set(`profiles_${message.author.id}.name`, name)

            return message.channel.send(`Your profile has been created with the name: **${name}**.`)
        })
        .catch(() => {
            return message.channel.send('You have run out of time to specify an username')
        })
    }
}