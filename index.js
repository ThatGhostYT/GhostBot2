const express = require("express");
const Discord = require("discord.js");
const fs = require("fs");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Command = require("./Command.js");
const db = new (require("@replit/database"));

const app = express();
const client = new Discord.Client({
	intents: 32767
});

const slash = [];
client.commands = new Discord.Collection();

fs.readdirSync("./commands/")
	.filter(file => file.endsWith(".js"))
	.forEach(file => {
		/**
		 * @type {Command}
		 */
		const cmd = require(`./commands/${file}`);
		client.commands.set(cmd.name,cmd);
		console.log(`Command ${cmd.name} loaded!`);
		
		const builder = new SlashCommandBuilder()
			.setName(cmd.name)
			.setDescription(cmd.description);
		cmd.slash.forEach(arg => {
			switch(arg.type){
				case "STRING":
					builder.addStringOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required);
						if(arg.choices){
							for(const choice of arg.choices){
								option.addChoice(choice.name,choice.value);
							}
						}
						return option;
					});
					break;

				case "INTEGER":
					builder.addIntegerOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						if(arg.choices){
							for(const choice of arg.choices){
								option.addChoice(choice.name,choice.value);
							}
						}
						return option;
					});
					break;

				case "NUMBER":
					builder.addNumberOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "BOOLEAN":
					builder.addBooleanOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "USER":
					builder.addUserOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "CHANNEL":
					builder.addChannelOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "ROLE":
					builder.addRoleOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "MENTIONABLE":
					builder.addMentionableOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;
			}
		});

		slash.push(builder);
	});
const rest = new REST({version: "9"}).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
	try{
		await rest.put(
			Routes.applicationGuildCommands("819035442925010954","857558295358996480"),
			{body: slash}
		);
	} catch(err){
		console.error(err);
	}
})();

fs.readdirSync("./events/")
	.filter(file => file.endsWith(".js"))
	.forEach(file => {
		const event = require(`./events/${file}`);

		if(event.once){
			client.once(event.name,(...args) => event.callback(client,...args));
		} else{
			client.on(event.name,(...args) => event.callback(client,...args));
		}
	});

client.login(process.env.DISCORD_BOT_TOKEN);

app.use(express.static(__dirname + "/public/"));

app.get("/",(req,res) => {
	res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(port));