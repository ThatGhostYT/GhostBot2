const {MessageActionRow,MessageSelectMenu,MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "settings",
	description: "Settings of the bot.",
	permission: "admin",
	slash: [],
	callback(interaction,args,client,db,embedColor){
		const embed = new MessageEmbed({
			color: embedColor
		})
			.setTitle("Settings")
			.setDescription("The settings is where you can configure your bot to what your server needs!")
			.addField("Options","**1. Embed:** Allows you to change the server embeds, for example the color.\n**2. Channels:** Log channel for Ghost Bot.\n**3. Roles:** Moderator and Admin roles.");
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId("settings")
					.setPlaceholder("Nothing Selected.")
					.addOptions([
						{
							label: "embed",
							description: "Server settings about embeds.",
							value: "embed"
						},
						{
							label: "channels",
							description: "Channels were the bot logs actions",
							value: "channels"
						},
						{
							label: "roles",
							description: "Moderator and Admin roles for permissions",
							value: "roles"
						}
					])
			);
		interaction.reply({
			embeds: [embed],
			ephemeral: true,
			components: [row]
		});
	}
});