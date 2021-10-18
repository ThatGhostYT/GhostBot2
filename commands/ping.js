const Command = require("../Command.js");

module.exports = new Command({
	name: "ping",
	description: "Replies with \"Pong!\"",
	callback(message,args,client){
		message.reply("Pong!");
	}
});