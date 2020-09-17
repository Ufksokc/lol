const db = require('quick.db')

module.exports = {
    name: 'bal',
    description: 'show the balance of the mentioned user',
    cooldown: 3,
    execute(message) {
        const profiles = new db.table('profiles')

        const member = message.mentions.members.first() || message.member

        const memberProfile = profiles.get(`profiles_${member.id}`)

        if(!memberProfile) return message.channel.send('This member dont have a profile.')

        const bal = profiles.get(`profiles_${member.id}.money`) || 0

        return message.channel.send(`${profiles.get(`profiles_${message.author.id}.name`)} has ${bal.toLocaleString()} GU.`)
    }
}