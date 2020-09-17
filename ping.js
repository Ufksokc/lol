module.exports = {
    name: 'ping',
    description: 'ping!',
    aliases: ['p'],
    cooldown: '3',
    execute(message) {
        return message.channel.send('Pong!')
    }
}