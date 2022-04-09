const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "currentsettings",
	description: "Displays the current settings.",
	permission: "moderator",
	slash: [],
	async callback(interaction,args,client){
		const log = await client.db.get(`log-channel-${interaction.guildId}`);
		const welcome = await client.db.get(`welcome-channel-${interaction.guildId}`);
		const moderator = await client.db.get(`moderator-${interaction.guildId}`);
		const admin = await client.db.get(`admin-${interaction.guildId}`);
		const member = await client.db.get(`member-${interaction.guildId}`);
		const dj = await client.db.get(`dj-${interaction.guildId}`);
		const color = await client.db.get(`embed-color-${interaction.guildId}`);
		
		const vembed = new MessageEmbed({
			color
		})
			.setTitle("Current Settings")
			.addField("Embed",`**Color** - ${color ? `[${color}](https://color-hex.com/color/${color.replace("#","")})` : "Default"}`)
			.addField("Channels",`**Log Channel** - ${log === null ? "None" : `<#${log}>`}\n**Welcome Channel** - ${welcome === null ? "None" : `<#${welcome}>`}`)
			.addField("Roles",`**Member** - ${member === null ? "None" : interaction.guild.roles.cache.get(member)}\n**Moderator** - ${moderator === null ? "None" : interaction.guild.roles.cache.get(moderator)}\n**Admin** - ${admin === null ? "None" : interaction.guild.roles.cache.get(admin)}\n**DJ** - ${dj === null ? "None" : interaction.guild.roles.cache.get(dj)}`);
		return interaction.reply({
			embeds: [vembed],
			ephemeral: true
		});
	}
});