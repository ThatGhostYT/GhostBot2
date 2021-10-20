const Command = require("../Command.js");

module.exports = new Command({
	name: "ping",
	aliases: [],
	details: {
		description: "Replies with \"Pong!\"",
		category: "Other"
	},
	slash: [],
	callback(message,args,client){
		message.reply("Pong!");
	}
});