const Command = require("../Command.js");

module.exports = new Command({
	name: "hello",
	description: "Replies with \"World\"",
	callback(message,args,client){
		message.reply("World!");
	}
});