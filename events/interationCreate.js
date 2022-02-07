const Discord = require("discord.js");
const db = new (require("@replit/database"));

module.exports = {
	name: "interactionCreate",
	async callback(client,interaction){
		if(interaction.isSelectMenu()){
			switch(interaction.customId){
				case "settings":
					if(interaction.values[0] === "embed"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Embed")
							.setDescription("What are you editing about the embeds?")
							.addField("Options","**1. Color:** The color of the embed.");
						const row = new Discord.MessageActionRow()
							.addComponents(
								new Discord.MessageSelectMenu()
									.setCustomId("embed")
									.setPlaceholder("Nothing Selected.")
									.addOptions([
										{
											label: "color",
											description: "Color of embeds",
											value: "color"
										}
									])
							)
						interaction.update({
							embeds: [embed],
							components: [row]
						});
					} else if(interaction.values[0] === "channels"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Channels")
							.setDescription("Special Channels the bot sends messages to.")
							.addField("Options","**1. Log Channel:** Where bot logs special actions made by people.\n**2. Ticket Channel:** Where people can get in contact with a moderator easily.");
						const row = new Discord.MessageActionRow()
							.addComponents(
								new Discord.MessageSelectMenu()
									.setCustomId("channels")
									.setPlaceholder("Nothing Selected.")
									.addOptions([
										{
											label: "log channel",
											description: "Channel where bot logs special events",
											value: "log"
										},
										{
											label: "ticket channel",
											description: "Channel where users can get access to a ticker to contact moderators",
											value: "ticket"
										}
									])
							);
						interaction.update({
							embeds: [embed],
							components: [row]
						});
					} else if(interaction.values[0] === "roles"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles")
							.setDescription("Roles settings for permissions.")
							.addField("Options","**1. Moderator:** Set the moderator role.\n**2. Admin:** Set the admin role.");
						const row = new Discord.MessageActionRow()
							.addComponents(
								new Discord.MessageSelectMenu()
									.setCustomId("roles")
									.setPlaceholder("Nothing Selected.")
									.addOptions([
										{
											label: "moderator",
											description: "Moderator role.",
											value: "moderator"
										},
										{
											label: "admin",
											description: "Admin role.",
											value: "admin"
										}
									])
							);
						interaction.update({
							embeds: [embed],
							components: [row]
						});
					}
					break;

				case "embed":
					if(interaction.values[0] === "color"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Embed -> Color")
							.setDescription("The color of the embeds.\n**Must** be a rgb hex code.")
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content === "cancel") return message.reply("Prompt canceled!");

							const regex = /\#([a-f0-9]{3}){1,2}$/gi;
							if(!regex.test(message.content)) return message.reply({
								content: "You must give a hex code value for the embed colors!"
							});

							db.get(`log-channel-${interaction.guildId}`)
								.then(cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: message.content
									})
										.setTitle("Embed Color Change")
										.setDescription(`**New Embed Color:** ${message.content}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							db.set(`embed-color-${interaction.guildId}`,message.content)
								.then(() => message.reply("Successfully changed embed color!"));
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					}
					break;

				case "channels":
					if(interaction.values[0] === "log"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Channels -> Log Channel")
							.setDescription("Mention a channel for the bot to send messages to.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.channels.size) return message.reply("Make sure you mention a channel.");

							const channel = message.mentions.channels.first();
							db.set(`log-channel-${interaction.guildId}`,channel.id)
								.then(() => message.reply("Successfully changed the log channel!"));
							channel.send("**This is now the new ghost bot log channel.**")
								.then(m => m.pin());
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					} else if(interaction.values[0] === "ticket"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Channels -> Ticket Channel")
							.setDescription("Mention a channel for the bot to send tickets to.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",async message => {
							collector.stop();

							if(message.content === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.channels.size) return message.reply("Make sure you mention a channel.");

							const channel = message.mentions.channels.first();
							db.set(`ticket-channel-${interaction.guildId}`,channel.id)
								.then(() => message.reply("Successfully changed the ticket channel!"));
							const ticketEmbed = new Discord.MessageEmbed({
								color: await db.get(`embed-color-${interaction.guildId}`)
							})
								.setTitle("Tickets")
								.setDescription("To open a ticket please select an issue.")
								.addField("Issues","**1.** Report\n**2.** Report a Staff\n**3.** Questions\n**4.** Other");
							const row = new Discord.MessageActionRow()
								.addComponents(
									new Discord.MessageSelectMenu()
										.setCustomId("ticket")
										.setPlaceholder("Nothing Selected.")
										.addOptions([
											{
												label: "Report",
												description: "Reports against fellow members of the server and how they are breaking the rules",
												value: "report"
											},
											{
												label: "Report a Staff",
												description: "Reports against staff members and how they are breaking the rules and/or abusing their powers",
												value: "report-staff"
											},
											{
												label: "Questions",
												description: "Questions for Staff",
												value: "questions"
											},
											{
												label: "Other",
												description: "A scenario that doesn't fit the other choices. Describe your issue",
												value: "other"
											}
										])
								);
							channel.send({
								embeds: [ticketEmbed],
								components: [row]
							});
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					}
					break;

				case "roles":
					if(interaction.values[0] === "moderator"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles -> Moderator")
							.setDescription("Mention a role for the bot to use as moderator role.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.roles.size) return message.reply("Make sure you mention a channel.");

							const role = message.mentions.roles.first();
							
							db.get(`log-channel-${interaction.guildId}`)
								.then(async cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: await db.get(`embed-color-${interaction.guildId}`)
									})
										.setTitle("Moderator Role Change")
										.setDescription(`**New Moderator Role:** ${role.toString()}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							db.set(`moderator-${interaction.guildId}`,role.id)
								.then(() => message.reply("Successfully changed the moderator role!"));
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					} else if(interaction.values[0] === "admin"){
						const embed = new Discord.MessageEmbed({
							color: await db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles -> Admin")
							.setDescription("Mention a role for the bot to use as admin role.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.roles.size) return message.reply("Make sure you mention a channel.");

							const role = message.mentions.roles.first();
							
							db.get(`log-channel-${interaction.guildId}`)
								.then(async cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: await db.get(`embed-color-${interaction.guildId}`)
									})
										.setTitle("Admin Role Change")
										.setDescription(`**New Admin Role:** ${role.toString()}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							db.set(`admin-${interaction.guildId}`,role.id)
								.then(() => message.reply("Successfully changed the admin role!"));
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					}
			}
		} else if(interaction.isCommand()){
			const {commandName: command} = interaction;
			const cmd = client.commands.get(command);
			const embedColor = await db.get(`embed-color-${interaction.guildId}`);

			if(cmd.permission){
				if(cmd.permission === "owner" && interaction.guild.ownerId !== interaction.user.id)
					return interaction.reply({
						content: "Only the owner of the server can use this command",
						ephemeral: true
					});
					
				else if(!interaction.member.roles.cache.get(await db.get(cmd.permission + "-" + interaction.guildId)))
					return interaction.reply({
						content: `Only ${cmd.permission}s can use this command.`,
						ephemeral: true
					});
			}
			
			cmd.callback(interaction,interaction.options,client,db,embedColor);
		}
	}
}