const express = require("express");
const app = express();
const Discord = require("discord.js");
const client = new Discord.Client({
	intents: 32767
});
const fs = require("fs");

const Command = require("./Command.js");

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
	});
client.once("ready", () => console.log("Online"));

client.on("messageCreate", message => {
	if(message.channel.type === "dm") return;
	if(message.author.bot) return;
	if(!message.content.startsWith(process.env.DEF_PREFIX)) return;

	const args = message.content.substring(process.env.DEF_PREFIX.length).split(/ +/);
	const cmd = args.shift().toLowerCase();

	const command = client.commands.find(c => c.name === cmd)

	if(!command) return message.reply(`Command \`${cmd}\` does not exist!`);

	command.callback(message,args,client);
});

client.login(process.env.DISCORD_BOT_TOKEN);
app.use(express.static(__dirname + "/public/"));

app.get("/", (req,res) => {
	res.sendFile(__dirname + "/public/index.html");
});

const port = process.env.PORT;
app.listen(port, () => console.log(port));