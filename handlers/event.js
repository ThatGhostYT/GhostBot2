const fs = require("fs");

module.exports = (client) => {
	fs.readdirSync("./events/")
		.filter(file => file.endsWith(".js"))
		.forEach(file => {
			const event = require(`../events/${file}`);
	
			if(event.once){
				client.once(event.name,(...args) => event.callback(client,...args));
			} else{
				client.on(event.name,(...args) => event.callback(client,...args));
			}
		});
}