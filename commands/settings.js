const {SlashCommandBuilder} = require("@discordjs/builders");

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
		.addSubcommand(sc =>
			sc.setName("view")
				.setDescription("Shows current server settings.")
		).addSubcommand(sc =>
			sc.setName("edit")
				.setDescription("Edits current server settings.")
		).addSubcommand(sc =>
			sc.setName("setup")
				.setDescription("Creates every role/channel needed for you.")
		).addSubcommand(sc =>
			sc.setName("clear")
				.setDescription("Clears all settings.")
		),
	slashOnly: true,
	async callback(client,interaction,args){
		if(args[0] == "edit"){
			const embedc = await client.db.get(`embed-color-${interaction.guildId}`) || "Default";
			const log = await client.db.get(`log-channel-${interaction.guildId}`);
			await interaction.showModal(
				new Modal()
					.setCustomId("settings")
					.setTitle("Settings")
					.addComponents([
						new MessageActionRow().addComponents(
							new TextInputComponent()
								.setCustomId("prefix")
								.setLabel("Prefix")
								.setRequired(false)
								.setMaxLength(3)
								.setPlaceholder(await client.db.get(`prefix-${interaction.guildId}`) || "!")
								.setStyle("SHORT")
						),
						new MessageActionRow().addComponents(
							new TextInputComponent()
								.setCustomId("embed-color")
								.setLabel("Embed Color")
								.setRequired(false)
								.setPlaceholder(embedc == "BLURPLE" ? "Default" : embedc)
								.setStyle("SHORT")
						),
						new MessageActionRow().addComponents(
							new TextInputComponent()
								.setCustomId("log-channel")
								.setLabel("Log Channel")
								.setRequired(false)
								.setPlaceholder(log ? `#${interaction.guild.channels.cache.get(log).name}` : "None")
								.setStyle("SHORT")
						)
					])
			);
		} else if(args[0] == "view"){
			const prefix = await client.db.get(`prefix-${interaction.guildId}`) || "!";
			const embedc = await client.db.get(`embed-color-${interaction.guildId}`) || "Default";
			const log = await client.db.get(`log-channel-${interaction.guildId}`);
			const embed = (await Embed(client,interaction.guild))
				.setTitle("Current Settings")
				.setDescription(`> **Prefix**: \`${prefix}\`\n> **Embed Color**: \`${embedc == "BLURPLE" ? "Default" : embedc}\`\n> **Log Channel**: ${log ? `<#${log}>` : "`None`"}`);

			interaction.reply({
				embeds: [embed],
				ephemeral: true
			});
		} else if(args[0] == "setup"){
			const changes = [];
			
			const nc = await interaction.guild.channels.create("ghostbot-logs");
			
			client.db.set(`log-channel-${interaction.guildId}`,nc.id)
				.then(() => {
					nc.send({
						content: "**This is the new GhostBot log channel.**"
					});
				});
		} else if(args[0] == "clear"){
			client.db.delete(`embed-color-${interaction.guildId}`);
			client.db.delete(`log-channel-${interaction.guildId}`);
			client.db.delete(`prefix-${interaction.guildId}`);

			interaction.reply({
				content: "Settings cleared!",
				ephemeral: true
			});
		}
	}
}