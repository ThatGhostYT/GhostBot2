const discord = require("discord.js");
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const fs = require("node:fs");

const client = new discord.Client({
	intents: [
		discord.Intents.FLAGS.GUILDS,
		discord.Intents.FLAGS.GUILD_MESSAGES
	],
	allowedMentions: {
		parsed: ["roles","users"]
	}
});

client.commands = new discord.Collection();
client.db = new (require("./database/db.js"));

const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN);

require("./handlers/events.js")(fs,client);

(async () => {
	try {
		await rest.put(
			Routes.applicationCommands("819035442925010954"), // client,guild
			{
				body: require("./handlers/commands.js")(fs,client)
			}
		)
	} catch (error) {
		console.error(error);
	}
})();

client.login(process.env.DISCORD_BOT_TOKEN);