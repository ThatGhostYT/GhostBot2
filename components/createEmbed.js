const {MessageEmbed} = require("discord.js");

module.exports = async (client,guild) => {
	return new MessageEmbed()
		.setColor(await client.db.get(`embed-color-${guild.id}`) || "BLURPLE")
}