const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "rules",
	description: "Sends server rules.",
	permission: "owner",
	slash: [],
	async callback(interaction,args,client){
		const embed = new MessageEmbed({
			color: await client.db.get(`embed-color-${interaction.guildId}`)
		})
			.setTitle("Rules")
			.setDescription("[**Bot Invite**](https://ghostbot.thatghost.repl.co/)\n[**Copy Support Server Invite URL**](https://discord.gg/RfmtnCw5YQ)\n\nOn top of these rules, you must follow Discord's [**Terms of Service**](https://discord.com/terms) and [**Guidelines.**](https://discord.com/guidelines)")
			.addField("Why are there commands in this server that there are nowhere else?","This server has exclusive commands.\n\nMost of these commands are being worked on, but others are just exclusive to this server.")
			.addField("Language","`Rule #1`\n> Here, we see everyone equal. Doesn't matter your skin tone, your sexuality, your gender, etc. We see everyone here as a complex human-being with their own thoughts, feelings, and emotions. Therefore discrimination of any kind is not tolerated what so ever.\n\n`Rule #2`\n> We don't mind that you curse but keep it at a tollerable level.\n\n`Rule #3`\n> Don't ping random people when asking for support.\n\n`Rule #4`\n> Keep topics in their corresponding channels.")
		interaction.reply({
			embeds: [embed]
		});
	}
});