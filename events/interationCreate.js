const Discord = require("discord.js");

module.exports = {
	name: "interactionCreate",
	async callback(client,interaction){
		if(interaction.isSelectMenu()){
			switch(interaction.customId){
				case "settings":
					if(interaction.values[0] === "embed"){
						const embed = new Discord.MessageEmbed({
							color: await client.db.get(`embed-color-${interaction.guildId}`)
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
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Channels")
							.setDescription("Special Channels the bot sends messages to.")
							.addField("Options","**1. Log Channel:** Where bot logs special actions made by people.\n**2. Welcome Channel:** Welcomes new members to the server.");
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
											label: "welcome channel",
											description: "Channel where new members are welcomed.",
											value: "welcome"
										}
									])
							);
						interaction.update({
							embeds: [embed],
							components: [row]
						});
					} else if(interaction.values[0] === "roles"){
						const embed = new Discord.MessageEmbed({
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles")
							.setDescription("Roles settings for permissions.")
							.addField("Options","**1. Moderator:** Set the moderator role.\n**2. Admin:** Set the admin role.\n**3. Member:** Set the member role.\n**4. DJ:** Set the DJ role.");
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
										},
										{
											label: "member",
											description: "Member role.",
											value: "member"
										},
										{
											label: "DJ",
											description: "DJ role.",
											value: "dj"
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
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Embed -> Color")
							.setDescription("The color of the embeds.\n**Must** be a rgb hex code.")
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content.toLowerCase() === "cancel") return message.reply("Prompt canceled!");

							const regex = /\#([a-f0-9]{3}){1,2}$/gi;
							if(!regex.test(message.content)) return message.reply({
								content: "You must give a hex code value for the embed colors!"
							});

							client.db.get(`log-channel-${interaction.guildId}`)
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
							client.db.set(`embed-color-${interaction.guildId}`,message.content)
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
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Channels -> Log Channel")
							.setDescription("Mention a channel for the bot to send messages to.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content.toLowerCase() === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.channels.size) return message.reply("Make sure you mention a channel.");

							const channel = message.mentions.channels.first();
							client.db.set(`log-channel-${interaction.guildId}`,channel.id)
								.then(() => message.reply("Successfully changed the log channel!"));
							channel.send("**This is now the new ghost bot log channel.**");
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					} else if(interaction.values[0] === "welcome"){
						const embed = new Discord.MessageEmbed({
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Channels -> Welcome Channel")
							.setDescription("Mention a channel for the bot to welcome members in.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content.toLowerCase() === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.channels.size) return message.reply("Make sure you mention a channel.");

							const channel = message.mentions.channels.first();
							client.db.get(`log-channel-${interaction.guildId}`)
								.then(async cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: await client.db.get(`embed-color-${interaction.guildId}`)
									})
										.setTitle("Welcome Channel Change")
										.setDescription(`**New Welcome Channel:** ${channel}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							client.db.set(`welcome-channel-${interaction.guildId}`,channel.id)
								.then(() => message.reply("Successfully changed the welcome channel!"));
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
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles -> Moderator")
							.setDescription("Mention a role for the bot to use as moderator role.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content.toLowerCase() === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.roles.size) return message.reply("Make sure you mention a channel.");

							const role = message.mentions.roles.first();
							
							client.db.get(`log-channel-${interaction.guildId}`)
								.then(async cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: await client.db.get(`embed-color-${interaction.guildId}`)
									})
										.setTitle("Moderator Role Change")
										.setDescription(`**New Moderator Role:** ${role.toString()}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							client.db.set(`moderator-${interaction.guildId}`,role.id)
								.then(() => message.reply("Successfully changed the moderator role!"));
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					} else if(interaction.values[0] === "admin"){
						const embed = new Discord.MessageEmbed({
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles -> Admin")
							.setDescription("Mention a role for the bot to use as admin role.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content.toLowerCase() === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.roles.size) return message.reply("Make sure you mention a channel.");

							const role = message.mentions.roles.first();
							
							client.db.get(`log-channel-${interaction.guildId}`)
								.then(async cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: await client.db.get(`embed-color-${interaction.guildId}`)
									})
										.setTitle("Admin Role Change")
										.setDescription(`**New Admin Role:** ${role.toString()}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							client.db.set(`admin-${interaction.guildId}`,role.id)
								.then(() => message.reply("Successfully changed the admin role!"));
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					} else if(interaction.values[0] === "member"){
						const embed = new Discord.MessageEmbed({
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles -> Member")
							.setDescription("Mention a role for the bot to use as member role.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content.toLowerCase() === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.roles.size) return message.reply("Make sure you mention a channel.");

							const role = message.mentions.roles.first();
							
							client.db.get(`log-channel-${interaction.guildId}`)
								.then(async cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: await client.db.get(`embed-color-${interaction.guildId}`)
									})
										.setTitle("Member Role Change")
										.setDescription(`**New Member Role:** ${role.toString()}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							client.db.set(`member-${interaction.guildId}`,role.id)
								.then(() => message.reply("Successfully changed the member role!"));
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					} else if(interaction.values[0] === "dj"){
						const embed = new Discord.MessageEmbed({
							color: await client.db.get(`embed-color-${interaction.guildId}`)
						})
							.setTitle("Settings -> Roles -> DJ")
							.setDescription("Mention a role for the bot to use as DJ role.");
						const collector = new Discord.MessageCollector(interaction.channel,{
							filter: m => m.author.id === interaction.user.id
						});

						collector.on("collect",message => {
							collector.stop();

							if(message.content.toLowerCase() === "cancel") return message.reply("Prompt canceled!");
							if(!message.mentions.roles.size) return message.reply("Make sure you mention a channel.");

							const role = message.mentions.roles.first();
							
							client.db.get(`log-channel-${interaction.guildId}`)
								.then(async cid => {
									if(!cid) return;
									const embed = new Discord.MessageEmbed({
										color: await client.db.get(`embed-color-${interaction.guildId}`)
									})
										.setTitle("DJ Role Change")
										.setDescription(`**New DJ Role:** ${role.toString()}`);
									interaction.guild.channels.cache.get(cid).send({
										embeds: [embed]
									});
								});
							client.db.set(`dj-${interaction.guildId}`,role.id)
								.then(() => message.reply("Successfully changed the DJ role!"));
						});

						interaction.update({
							embeds: [embed],
							components: []
						});
					}
					break;
			}
		} else if(interaction.isCommand()){
			const {commandName: command} = interaction;
			const cmd = client.commands.get(command);

			if(cmd.permission){
				if(cmd.permission === "owner" && interaction.guild.ownerId !== interaction.user.id)
					return interaction.reply({
						content: "Only the owner of the server can use this command.",
						ephemeral: true
					});

				else if(!(await client.db.get(cmd.permission + "-" + interaction.guildId)) && interaction.guild.ownerId !== interaction.user.id)
					return interaction.reply({
						content: `Only the owner of the server can use this command until the ${cmd.permission} role is set.`,
						ephemeral: true
					});
					
				else if(!interaction.member.roles.cache.get(await client.db.get(cmd.permission + "-" + interaction.guildId)) && interaction.guild.ownerId !== interaction.user.id)
					return interaction.reply({
						content: `Only ${cmd.permission}s can use this command.`,
						ephemeral: true
					});
			}
			
			cmd.callback(interaction,interaction.options,client);
		} else if(interaction.isButton()){
			switch(interaction.customId){
				case "welcome":
					const name = interaction.message.embeds[0].title.replace("Say hello to ","").replace(/!$/,"");
					const user = interaction.guild.members.cache.filter(m => m.user.username === name).first();

					if(user === interaction.user) interaction.reply(`Hello ${user}! 👋`);
					else interaction.reply(`${user}, ${interaction.user} says hello! 👋`);
					
					break;
			}
		}
	}
}