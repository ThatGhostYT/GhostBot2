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
	async callback(interaction,args,client,db,embedColor){
		const target = args.getUser("user");
		const reason = args.getString("reason");

		const warnings = await db.get(`warnings-${target.id}`) || 0;

		db.set(`warnings-${target.id}`,warnings + 1);

		const logChannelId = await db.get(`log-channel-${interaction.guild.id}`);

		const embed = new MessageEmbed({
			color: embedColor
		})
			.setTitle("Warning")
			.setDescription(`**Target:** ${target.toString()}\n**Moderator:** ${interaction.user.toString()}\n**Reason:** \`${reason}\`\n**${target.username}** now has **${warnings + 1}** warnings`)
			.setImage(target.displayAvatarURL({
				format: "png",
				dynamic: true
			}));
		interaction.guild.channels.cache.get(logChannelId).send({
			embeds: [embed]
		})
			.then(m => {
				interaction.reply(m.url);
			});
	}
});