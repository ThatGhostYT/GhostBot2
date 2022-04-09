const {MessageActionRow,MessageButton} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "invite",
	description: "Sends bot invite url.",
	slash: [],
	callback(interaction,args,client){
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton({
					label: "Invite Me!",
					style: "LINK",
					url: "https://ghostbot.thatghost.repl.co/",
					emoji: "🔗"
				})
			);
		interaction.reply({
			content: "Invite me to your server.",
			ephemeral: true,
			components: [row]
		});
	}
});