module.exports = () => {
	const Discord = require("discord.js");
	const client = new Discord.Client({
		intents: 32767
	});

	client.on("ready", () => console.log("Online"));

	client.login(process.env.DISCORD_BOT_TOKEN);
}