const Command = require("../Command.js");

module.exports = new Command({
	name: "echo",
	aliases: [],
	details: {
		description: "Replies with what you said!",
		category: "Other"
	},
	slash: [
		{
			name: "message",
			description: "The message you want the bot to reply with.",
			required: true,
			type: "STRING"
		}
	],
	callback(message,args,client){
		message.reply(`You said: \`${args.join(" ").replace("@", "")}\``);
	}
});
