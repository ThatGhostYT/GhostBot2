const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "avatar",
	description: "Shows a user\'s avatar.",
	slash: [
		{
			name: "user",
			description: "The user\'s pfp you want to see.",
			required: false,
			type: "USER"
		}
	],
	async callback(interaction,args,client){
		const embeds = [];

		const user = args.getUser("user");

		if(!user){
			const embed = new MessageEmbed({
				color: await client.db.get(`embed-color-${interaction.guildId}`)
			})
				.setTitle(`${interaction.user.username}#${interaction.user.discriminator}`)
				.setImage(interaction.user.displayAvatarURL({
					format: "png",
					dynamic: true
				}));
			embeds.push(embed);
		} else{
			const embed = new MessageEmbed({
				color: await client.db.get(`embed-color-${interaction.guildId}`)
			})
				.setTitle(`${user.username}#${user.discriminator}`)
				.setImage(user.displayAvatarURL({
					format: "png",
					dynamic: true
				}));
			embeds.push(embed);
		}

		interaction.reply({
			embeds,
			ephemeral: true
		});
	}
});