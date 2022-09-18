const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
	name: "ping",
	aliases: ["p","ping-pong","pong"],
	description: "Test ping to discord's server endpoint.",
	slash: new SlashCommandBuilder(),
	callback(client,interaction,args,isSlash){
		interaction.reply({
			content: `Pong! :ping_pong:\n**${client.ws.ping}ms** Latency!`,
			ephemeral: isSlash
		});
	}
}