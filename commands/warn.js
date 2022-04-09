const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "warn",
	description: "Warns a user.",
	permission: "moderator",
	slash: [
		{
			name: "user",
			description: "The person you are warning.",
			required: true,
			type: "USER"
		},
		{
			name: "reason",
			description: "The reason you gave the warning.",
			required: true,
			type: "STRING"
		}
	],
	async callback(interaction,args,client){
		const target = args.getUser("user");
		const reason = args.getString("reason");

		const warnings = await client.db.get(`warnings-${target.id}`) || 0;

		client.db.set(`warnings-${target.id}-${interaction.guildId}`,warnings + 1);

		const logChannelId = await client.db.get(`log-channel-${interaction.guild.id}`);

		interaction.reply({
			content: `Member ${target} warned.`,
			ephemeral: true
		});
		
		if(logChannelId){
			const embed = new MessageEmbed({
				color: await client.db.get(`embed-color-${interaction.guildId}`)
			})
				.setTitle("Warning")
				.setDescription(`**Target:** ${target.toString()}\n**Moderator:** ${interaction.user.toString()}\n**Reason:** \`${reason}\`\n**${target.username}** now has **${warnings + 1}** warnings`)
				.setImage(target.displayAvatarURL({
					format: "png",
					dynamic: true
				}));
			interaction.guild.channels.cache.get(logChannelId).send({
				embeds: [embed]
			});
		}
	}
});