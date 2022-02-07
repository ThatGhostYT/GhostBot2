const Command = require("../Command.js");

module.exports = new Command({
	name: "uptime",
	description: "Sends the amount of time the bot has been online for.",
	slash: [],
	callback(interaction,args,client,db,embedColor){
		const days = Math.floor(client.uptime / 86400000);
		const hours = Math.floor(client.uptime / 3600000) % 24;
		const minutes = Math.floor(client.uptime / 60000) % 60;
		const seconds = Math.floor(client.uptime / 1000) % 60;

		interaction.reply({
			content: `**Days:** ${days}\n**Hours:** ${hours}\n**Minutes:** ${minutes}\n**Seconds:** ${seconds}`,
			ephemeral: true
		});
	}
});