const Command = require("../Command.js");

module.exports = new Command({
	name: "hello",
	aliases: [],
	details: {
		description: "Replies with \"World\"",
		category: "Other"
	},
	slash: [],
	callback(message,args,client){
		message.reply("World!");
	}
});