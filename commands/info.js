const {SlashCommandBuilder} = require("@discordjs/builders");
const {Permissions,MessageButton,MessageActionRow} = require("discord.js");

const Embed = require("../components/createEmbed.js");

const prettyms = (...args) => import("pretty-ms")
	.then(({default: pm}) => pm(...args));

module.exports = {
	name: "info",
	aliases: [],
	description: "Info about the bot.",
	slash: new SlashCommandBuilder(),
	async callback(client,interaction,args,isSlash){
		const startUsage = process.cpuUsage();
		const now = Date.now();

		while(Date.now() - now < 500);

		const userUsage = (process.cpuUsage(startUsage).user / 1024).toFixed(1);
		const sysUsage = (process.cpuUsage(startUsage).system / 1024).toFixed(1);
		
		const embed = (await Embed(client,interaction.guild))
			.setTitle("Bot Info")
			.setThumbnail(client.user.displayAvatarURL({
				format: "png",
				dynamic: true
			}))
			.addFields(
				{
					name: "Commands",
					value: client.commands.size.toString(),
					inline: true
				},
				{
					name: "Servers",
					value: client.guilds.cache.size.toString(),
					inline: true
				},
				{
					name: "Uptime",
					value: await prettyms(client.uptime),
					inline: true
				},
				{
					name: "Server Prefix",
					value: await client.db.get(`prefix-${interaction.guildId}`),
					inline: true
				},
				{
					name: "Author",
					value: "<@797291470457274378>",
					inline: true
				},
				{
					name: "Node Version",
					value: process.version,
					inline: true
				},
				{
					name: "CPU Usage",
					value: `**System:** ${sysUsage.toLocaleString()}mb\n**User:** ${userUsage.toLocaleString()}mb`,
					inline: true
				},
				{
					name: "Latency",
					value: `${client.ws.ping}ms`,
					inline: true
				},
				{
					name: "Dependencies",
					value: `\`\`\`json\n${JSON.stringify(require("../package.json").dependencies,null," ")}\`\`\``,
				}
			);

		interaction.reply({
			embeds: [embed],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setLabel("Add Me to Your Server!")
						.setStyle("LINK")
						.setEmoji("🔗")
						.setURL(client.generateInvite({
							scopes: ["bot","applications.commands"],
							permissions: Permissions.FLAGS.ADMINISTRATOR
						})),
					new MessageButton()
						.setLabel("Join the Support Server!")
						.setStyle("LINK")
						.setEmoji("🔗")
						.setURL("https://discord.com/invite/RfmtnCw5YQ"),
				)
			],
			ephemeral: isSlash
		});
	}
}