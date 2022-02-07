const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "warnings",
	description: "Sends the number of warnings a user has.",
	slash: [
		{
			name: "user",
			description: "The person\'s warnings you want to see.",
			required: false,
			type: "USER"
		}
	],
	async callback(interaction,args,client,db,embedColor){
		const target = args.getUser("user") || interaction.user;

		const warnings = await db.get(`warnings-${target.id}`);

		const embed = new MessageEmbed({
			color: embedColor
		})
			.setTitle(`${target.username}\'s warnings`)
			.setDescription(`**${target.username}** has **${warnings === null ? 0 : warnings}** warnings.`)
			.setImage(target.displayAvatarURL({
				format: "png",
				dynamic: true
			}));
		interaction.reply({
			embeds: [embed],
			ephemeral: true
		});
	}
});