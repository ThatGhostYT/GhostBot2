const {MessageActionRow,MessageButton} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "dashboard",
	description: "Replies with the website link.",
	slash: [],
	callback(interaction,args,client,db,embedColor){
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton({
					label: "Dashboard",
					style: "LINK",
					url: "https://ghostbot.thatghost.repl.co/",
					emoji: "🌐"
				})
			);
		interaction.reply({
			content: "Web dashboard",
			ephemeral: true,
			components: [row]
		});
	}
});