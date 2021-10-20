const express = require("express");
const app = express();
const Discord = require("discord.js");
const client = new Discord.Client({
	intents: 32767
});

const fs = require("fs");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const {SlashCommandBuilder} = require("@discordjs/builders");

const Command = require("./Command.js");

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
			.setDescription(cmd.details.description);
		cmd.slash.forEach(arg => {
			slashCmd.addStringOption(option => {
				option.setName(arg.name)
					.setDescription(arg.description)
					.setRequired(arg.required)
				arg.choices.forEach(choice => {
					option.addChoice(choice.name,choice.value);
				});
			});
		});

		slash.push(builder);
	});
const rest = new REST({version: 9}).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
	try{
		await rest.put(
			Routes.applicationGuildCommands("871280132667604993","222078108977594368"),
			{body: slash}
		);
	} catch(err){
		console.error(err);
	}
})();

client.once("ready", () => console.log("Inspire Bot Online"));

client.on("messageCreate", message => {
	if(message.channel.type === "dm") return;
	if(message.author.bot) return;
	if(!message.content.startsWith(process.env.DEF_PREFIX)) return;

	const args = message.content.substring(process.env.DEF_PREFIX.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command = client.commands.get(cmd) || client.commands.find(a => a.aliases.includes(cmd));

	if(!command) return message.reply(`Command \`${cmd}\` does not exist!`);

	command.callback(message,args,client);
});

client.login(process.env.DISCORD_BOT_TOKEN);

app.use(express.static(__dirname + "/public/"));

app.get("/", (req,res) => {
	res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(port));