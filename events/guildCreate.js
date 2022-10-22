const {
	MessageEmbed,
	MessageButton,
	MessageActionRow
} = require("discord.js");

const Embed = require("../components/createEmbed.js");

const prettyms = (...args) => import("pretty-ms")
	.then(({default: pm}) => pm(...args));

module.exports = {
	name: "guildCreate",
	async callback(client,guild){
		client.user.presence.set({
			activities: [
				{
					name: `${client.guilds.cache.size} servers.`,
					type: "WATCHING"
				}
			]
		});

		let channel;
		for(const [k,v] of guild.channels.cache){
			if(v.type === "GUILD_TEXT" && v !== guild.rulesChannel){
				channel = v;
				break;
			}
		}

		const startUsage = process.cpuUsage();
		const now = Date.now();

		while(Date.now() - now < 500);

		const userUsage = (process.cpuUsage(startUsage).user / 1024).toFixed(1);
		const sysUsage = (process.cpuUsage(startUsage).system / 1024).toFixed(1);

		const embed = (await Embed(client,guild))
			.setTitle("Say Hello to GhostBot!")
			.setDescription("Thanks for inviting GhostBot to your server!")
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
					name: "Prefix",
					value: "!",
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
					name: "Platform",
					value: process.platform,
					inline: true
				},
				{
					name: "Dependencies",
					value: `\`\`\`json\n${JSON.stringify(require("../package.json").dependencies,null," ")}\`\`\``,
				}
			);

		channel.send({
			content: `<@${guild.ownerId}> Thanks for inviting me! Use \`/help\` for help using commands.`,
			embeds: [embed],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setLabel("Join the Support Server!")
						.setStyle("LINK")
						.setEmoji("🔗")
						.setURL("https://discord.com/invite/RfmtnCw5YQ"),
				)
			]
		});
	}
}