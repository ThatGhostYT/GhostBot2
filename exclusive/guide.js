const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "guide",
	description: "Sends bot guide.",
	permission: "owner",
	slash: [],
	async callback(interaction,args,client){
		const embed = new MessageEmbed({
			color: await client.db.get(`embed-color-${interaction.guildId}`)
		})
			.setTitle("Guide")
			.setDescription("[**Bot Invite**](https://ghostbot.thatghost.repl.co/)\n[**Support Server**](https://discord.gg/RfmtnCw5YQ)\n\nThis is a guide to help use the bot.")
			.addField("Viewing your Current Settings","To view your current settings, use `/currentsettings`.")
			.addField("Cancelling Prompts","Whenever GhostBot is prompting you for something, if you type `cancel` the prompt is cancelled and you can send messages without GhostBot using them!")
			.addField("Permissions","The first thing you want to do when you invite your bot is set permissions. To this use `/settings` and open the roles menu. There, select either admin or moderator and mention a role. Now whenever someone tries to use a command it checks to see if the user has that role.")
			.addField("Log Channel","Next thing you want to do when you get GhostBot is to set a log channel. GhostBot will log special events here. To do this use `/settings` and open the channels menu. There, select log channel and mention the channel you want GhostBot to send messages to.")
			.addField("Your all set!","Everything else on the `/settings` command is optional.");
		interaction.reply({
			embeds: [embed]
		});
	}
});