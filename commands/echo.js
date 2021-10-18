const Command = require("../Command.js");

module.exports = new Command({
	name: "echo",
	description: "Replies with what you said!",
	callback(message,args,client){
		message.reply(`You said: \`${args.join(" ")}\``);
	}
});