const {MessageActionRow,MessageButton} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "dashboard",
	aliases: ["website","web-dashboard","web"],
	details: {
		description: "Replies with the website link.",
		category: "Other"
	},
	slash: [],
	callback(message,args,client){
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton({
					label: "Dashboard",
					style: "LINK",
					url: "https://inspirebot.thatghost.repl.co/",
					emoji: "🌐"
				})
			);
		message.reply({
			content: "Dashboard",
			components: [row]
		});
	}
});