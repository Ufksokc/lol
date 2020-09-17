const db = require('quick.db')

module.exports = {
    name: 'buy',
    description: 'buy an item',
    cooldown: 3,
    execute(message) {
        const profile = new db.table('profiles')

        const memberProfile = profile.get(`profiles_${message.author.id}`)

        if(!memberProfile) return message.channel.send('You dont have a profile')

        const items = []

        items.push("ticket")
        if(memberProfile.bought.ticket > 10) items.push('goldenticket')

        if(!items.includes(args[1] || !args[1])) return message.channel.send(`
You need to buy something from the following
${items.map(i => i).join(', ')}
    `)

    var cost = profile.get(`profiles_${message.author.id}.money`) - cost

    if(!args[2]) {
        const afterBal = profile.get(`profiles_${message.author.id}.money`)
        if(afterBal > 0 ) {
            profile.substract(`profiles_${message.author.id}.money`, cost)
            profile.add(`profiles_${message.author.id}.bought.${args[1]}`, 1)
            return message.channel.send(`You bought a ${args[1]} for ${cost.toLocaleString()}.`)
      } else {
          return message.channel.send('You cant afford this.')
      } 
    } else if(args[2]) {
        var bal = profile.get(`profiles_${message.author.id}.money`)
        const cost2 = profile.get(`profiles_${message.author.id}.bought.${args[1]}`) * 10 + 10 || 10

        if(cost2 > bal) return message.channel.send('You cant afford this.')

        var oldBal = bal
        var newBal = 0
        var boughtItems = 0

        while(bal > 0) {
            var oldBal = bal
            bal = bal - cost2
            boughtItems = boughtItems + 1
        }

        var latestPrice = profile.get(`profiles_${message.author.id}.bought.${args[1]}`) || 10
        newBal = newBal + (latestPrice + 10) + (latestPrice * 10)
        boughtItems = boughtItems - 2

        if(boughtItems === 0) return message.channel.send('You cant buy 0 items.')

        profile.add(`profiles_${message.author.id}.bought.${args[1]}`, boughtItems)
        profile.set(`profiles_${message.author.id}.money`, newBal)

        return message.channel.send(`You bought ${boughtItems.toLocaleString()} for ${(oldBal-+ newBal).toLocaleString()}.`)
    } else if(args[2]) {
        const bal = profile.get(`profiles_${message.author.id}.money`)

        if(isNaN(args[2])) return message.channel.send(`This is not a valid amount of ${args[1]} to buy.`)

        if(args[2] < 0) return message.channel.send(`You cant buy 0 items of ${args[1]}`)

        const extraCost = (10 * args[2])

        const newCost = (cost * args[2]) + extraCost

        if(newCost > bal) return message.channel.send('You cant afford this.')

        profile.substract(`profiles_${message.author.id}.money`, newCost)
        profile.add(`profiles_${message.author.id}.bought.${args[1]}`, args[2])
        return message.channel.send(`You bought ${args[2]} of ${args[1]} for ${newCost.toLocaleString()}.`)
    }
  }
}