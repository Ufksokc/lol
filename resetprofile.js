const db = require('quick.db')

module.exports = {
    name: 'resetprofile',
    description: 'reset a user profile',
    aliases: ['resetp'],
    cooldown: 3,
    async execute(message) {
        const profiles = new db.table('profiles')

        const userProfile = profiles.get(`profiles_${message.author.id}`)

        if(!userProfile) return message.channel.send('You dont have a profile.') 

        const msg = await message.channel.send('Are you sure you wanna reset your profile?')
        await msg.react('🟩')
        await msg.react('🟥')

        const filter = (reaction, user) => {
            return (reaction.emoji.name == '🟩' || reaction.emoji.name == '🟥') && user.id == message.author.id
        }

        msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time']})
        .then(reaction => {
            if(reaction.first().emoji.name == '🟩') {
                profiles.delete(`profiles_${message.author.id}`)
                return message.channel.send('Deleted your profile sucessfully.')
            } else if(reaction.first().emoji.name == '🟥') {
                return message.channel.send('Cancelled your profile delete request.')
            }
        })
        .catch(() => {
            return message.channel.send('You ran out of time.')
        })
    }
}