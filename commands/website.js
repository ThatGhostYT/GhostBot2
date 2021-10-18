const Command = require("../Command.js");

module.exports = new Command({
	name: "website",
	description: "Replies with the website link.",
	callback(message,args,client){
		message.reply("Our dashboard can be found at https://inspirebot.thatghost.repl.co/");
	}
});