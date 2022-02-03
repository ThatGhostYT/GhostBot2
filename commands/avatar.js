const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "avatar",
	aliases: ["profile","pfp","profile-picture"],
	details: {
		description: "Shows a user\'s avatar.",
		category: "Other",
		syntax: "avatar ...users?"
	},
	slash: [],
	callback(message,args,client,prefix){
		const embeds = [];
		if(!message.mentions.users.size){
			const embed = new MessageEmbed({
				color: 0x0099ff
			})
				.setTitle(message.author.username + "#" + message.author.discriminator)
				.setImage(message.author.displayAvatarURL({
					dynamic: true,
					format: "png"
				}));
			embeds.push(embed);
		} else{
			for(const [id,user] of message.mentions.users){
				const embed = new MessageEmbed({
					color: 0x0099ff
				})
					.setTitle(user.username + "#" + user.discriminator)
					.setImage(user.displayAvatarURL({
						dynamic: true,
						format: "png"
					}));
				embeds.push(embed);
			}
		}

		message.reply({
			embeds
		});
	}
});