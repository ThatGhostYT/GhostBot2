const Command = require("../Command.js");

module.exports = new Command({
	name: "website",
	description: "Replies with the website link.",
	callback(message,args,client){
		message.channel.send("https://inspireimagineering.wixsite.com/hhn2021tpt2");
	}
});