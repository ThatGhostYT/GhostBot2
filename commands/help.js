const {SlashCommandBuilder} = require("@discordjs/builders");
const Embed = require("../components/createEmbed.js");

module.exports = {
	name: "help",
	aliases: ["h","?","details"],
	description: "Get details about all commands or a specific command.",
	slash: new SlashCommandBuilder()
		.addStringOption(option =>
			option.setName("command")
				.setDescription("A specific command to get details about.")
				.setRequired(false)
		),
	async callback(client,interaction,args,isSlash){
		if(args[0]){
			if(!(client.commands.get(args[0]) || client.commands.find(a => a.aliases?.includes(args[0])))) return interaction.reply({
				content: `Cannot find command **${args[0]}**.`,
				ephemeral: isSlash
			});

			const command = client.commands.get(args[0]) || client.commands.find(a => a.aliases.includes(args[0]))
			
			const embed = (await Embed(client,interaction.guild))
				.setTitle(`${command.name} Details`)
				.addFields(
					{
						name: "Description",
						value: command.description + (command.slashOnly ? "\n**This command can only be used with slash commands**" : "")
					},
					{
						name: "Arguments",
						value: command.slash.options.length == 0
							? "This command has no arguments."
							: command.slash.options.map(o => {
								return `> **Name:** ${o.name}\n> **Description:** ${o.description}\n> **${o.required ? "Required" : "Optional"}**\n`;
							}).join("\n")
					}
				);

			interaction.reply({
				embeds: [embed],
				ephemeral: isSlash
			});
		} else{
			const p = await client.db.get(`prefix-${interaction.guildId}`) || "!";
			
			const embed = (await Embed(client,interaction.guild))
				.setTitle("Help")
				.setDescription(`Prefix is **${p}**\n` + client.commands.mapValues(v => {
					return `> **${v.name}:** ${v.description}`
				}).toJSON().join("\n"));

			interaction.reply({
				embeds: [embed],
				ephemeral: isSlash
			});
		}
	}
}