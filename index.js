const express = require("express");
const Discord = require("discord.js");
const fs = require("fs");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Command = require("./Command.js");
const db = new(require("@replit/database"));
const hevents = require("./handlers/event.js");
const hex = require("./handlers/exclusive.js");
const hcommands = require("./handlers/command.js");

const app = express();
const client = new Discord.Client({
	intents: 32767
});

client.commands = new Discord.Collection();
client.db = db;

const slash = hcommands(client);
const exclusive = hex(client);
hevents(client);

const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
	try{
		await rest.put(
			Routes.applicationCommands("819035442925010954"),
			{body: slash}
		);
		await rest.put(
			Routes.applicationGuildCommands("819035442925010954","940786085544464436"),
			{body: exclusive}
		);
	} catch(err){
		console.error(err);
	}
})();

app.get("/",(req,res) => {
	res.redirect("https://discord.com/api/oauth2/authorize?client_id=819035442925010954&permissions=8&scope=bot%20applications.commands");
});

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(port));

client.login(process.env.DISCORD_BOT_TOKEN);