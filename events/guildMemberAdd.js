const {MessageEmbed,MessageActionRow,MessageButton} = require("discord.js");

module.exports = {
	name: "guildMemberAdd",
	async callback(client,member){
		if(member.user.bot) return;
		const embed = new MessageEmbed({
			color: await client.db.get(`embed-color-${member.guild.id}`)
		})
			.setTitle(`Say hello to ${member.user.username}!`)
			.setDescription(`You are the ${member.guild.members.size} member on **${member.guild.name}!**`)
			.setImage(member.displayAvatarURL({
				format: "png",
				dynamic: true
			}));
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("welcome")
					.setLabel("Say Hello!")
					.setStyle("PRIMARY")
					.setEmoji("👋")
			);
		const welcome = await client.db.get(`welcome-channel-${member.guild.id}`);
		
		member.guild.channels.cache.get(welcome).send({
			embeds: [embed],
			components: [row]
		});

		member.roles.add(
			member.guild.roles.cache.get(
				await db.get(`member-${member.guild.id}`)
			)
		);
	}
}