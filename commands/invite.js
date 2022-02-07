const {MessageActionRow,MessageButton} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "invite",
	description: "Sends bot invite url.",
	slash: [],
	callback(interaction,args,client,db,embedColor){
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton({
					label: "Invite Me!",
					style: "LINK",
					url: "https://discord.com/api/oauth2/authorize?client_id=819035442925010954&permissions=8&scope=bot%20applications.commands",
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