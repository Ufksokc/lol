const playing = true

module.exports = (client) => {
    if(playing == true) {
		client.user.setActivity('ec!help')
	}
    console.log('Ready!')
}