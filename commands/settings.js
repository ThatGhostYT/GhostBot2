const Command = require("../Command.js");

module.exports = new Command({
	name: "settings",
	aliases: ["s","config"],
	details: {
		description: "Settings of the bot.",
		category: "Useful",
		syntax: "settings name value"
	},
	slash: [],
	callback(message,args,client,prefix){
		
	}
});