const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits: Permissions} = require("discord-api-types/v10");

const {
	MessageActionRow,
	Modal,
	TextInputComponent
} = require("discord.js");
const Embed = require("../components/createEmbed.js");

module.exports = {
	name: "settings",
	description: "Server settings.",
	aliases: [],
	slash: new SlashCommandBuilder()
		.setDefaultMemberPermissions(Permissions.ManageGuild)
		.addSubcommand(sc =>
			sc.setName("view")
				.setDescription("Shows current server settings.")
		).addSubcommand(sc =>
			sc.setName("edit")
				.setDescription("Edits current server settings.")
		).addSubcommand(sc =>
			sc.setName("clear")
				.setDescription("Clears all settings.")
		),
	async callback(client,interaction,args){
		if(args[0] == "edit"){
			const embedc = await client.db.get(`embed-color-${interaction.guildId}`) || "Default";
			await interaction.showModal(
				new Modal()
					.setCustomId("settings")
					.setTitle("Settings")
					.addComponents([
						new MessageActionRow().addComponents(
							new TextInputComponent()
								.setCustomId("embed-color")
								.setLabel("Embed Color")
								.setRequired(false)
								.setPlaceholder(embedc == "BLURPLE" ? "Default" : embedc)
								.setStyle("SHORT")
						)
					])
			);
		} else if(args[0] == "view"){
			const embedc = await client.db.get(`embed-color-${interaction.guildId}`) || "Default";
			const embed = (await Embed(client,interaction.guild))
				.setTitle("Current Settings")
				.setDescription(`> **Embed Color**: \`${embedc == "BLURPLE" ? "Default" : embedc}\``);

			interaction.reply({
				embeds: [embed],
				ephemeral: true
			});
		} else if(args[0] == "clear"){
			client.db.delete(`embed-color-${interaction.guildId}`);
			client.db.delete(`prefix-${interaction.guildId}`);

			interaction.reply({
				content: "Settings cleared!",
				ephemeral: true
			});
		}
	}
}