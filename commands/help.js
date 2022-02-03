const fs = require("fs");
const {MessageEmbed} = require("discord.js");

const Command = require("../Command.js");

module.exports = new Command({
	name: "help",
	aliases: ["?","h"],
	details: {
		description: "Gives details about commands.",
		category: "Useful",
		syntax: "help ...commands?"
	},
	slash: [],
	callback(message,args,client,prefix){
		const embed = new MessageEmbed({
			color: 0x0099ff,
			title: "Commands"
		});
		
		if(!args.length){
			fs.readdirSync(__dirname)
				.filter(file => file.endsWith(".js"))
				.forEach(file => {
					/**
					 * @type {Command}
					 */
					const cmd = require(__dirname + `/${file}`);
					const similar = fs.readdirSync(__dirname)
						.filter(file => require(__dirname + `/${file}`).details.category === cmd.details.category
							&& file.replace(/\.js$/g,"") !== cmd.name
							&& file.replace(/\.js$/g,"") !== "help"
						)
						.map(c => c.replace(/\.js$/g,""));
					embed.addField(cmd.name[0].toUpperCase() + cmd.name.slice(1),`**Category:** ${cmd.details.category}\n**Description:** ${cmd.details.description}\n**Alliases:** ${cmd.aliases.length ? cmd.aliases.join(", ") : "None"}\n**Syntax:** ${prefix}${cmd.details.syntax}\n**Has Slash Command:** ${cmd.slash.length ? "Yes" : "No"}\n**Similar Commands:** ${similar.length ? similar.join(", ") : "None"}`);
				});
		} else{
			for(const arg of args){
				const cmd = client.commands.get(arg) || client.commands.find(a => a.aliases.includes(arg));
				
				const similar = fs.readdirSync(__dirname)
					.filter(file => require(__dirname + `/${file}`).details.category === cmd.details.category
						&& file.replace(/\.js$/g,"") !== cmd.name
						&& file.replace(/\.js$/g,"") !== "help"
					)
					.map(c => c.replace(/\.js$/g,""));
				embed.addField(cmd.name[0].toUpperCase() + cmd.name.slice(1),`**Category:** ${cmd.details.category}\n**Description:** ${cmd.details.description}\n**Alliases:** ${cmd.aliases.length ? cmd.aliases.join(", ") : "None"}\n**Syntax:** ${cmd.details.syntax}\n**Has Slash Command:** ${cmd.slash.length ? "Yes" : "No"}\n**Similar Commands:** ${similar.length ? similar.join(", ") : "None"}`);
			}
		}

		message.reply({
			embeds: [embed]
		});
	}
});