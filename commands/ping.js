const Command = require("../Command.js");

module.exports = new Command({
	name: "ping",
	aliases: ["p"],
	details: {
		description: "Replies with \"Pong!\"",
		category: "Other",
		syntax: "ping"
	},
	slash: [],
	callback(message,args,client,prefix){
		message.reply("Pong!");
	}
});