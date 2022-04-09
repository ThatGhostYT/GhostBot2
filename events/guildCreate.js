const {MessageEmbed} = require("discord.js");

module.exports = {
	name: "guildCreate",
	async callback(client,guild){
		client.user.presence.set({
			activities: [
				{
					name: `${client.guilds.cache.size} servers.`,
					type: "WATCHING"
				}
			]
		});

		let channel;
		for(const [k,v] of guild.channels.cache){
			if(v.type === "GUILD_TEXT" && v !== guild.rulesChannel){
				channel = v;
				break;
			}
		}

		const owner = client.users.cache.find(u => u.id === guild.ownerId);
		
		const embed = new MessageEmbed({
			color: await client.db.get(`embed-color-${guild.id}`)
		})
			.setTitle("Say hello to GhostBot!")
			.setDescription("[**Bot Invite**](https://ghostbot.thatghost.repl.co/)\n[**Join Our Support Server!**](https://discord.gg/RfmtnCw5YQ)\n\nThis is a copy of the guide from the support server. The guide in the support server might be more up-to-date.")
			.addField("Important!","If you ever have to remove GhostBot from your server, GhostBot automatically deletes all data saved from the server, Including: Evertheying in the `/settings` command and warnings.")
			.addField("Viewing your Current Settings","To view your current settings, use `/currentsettings`.")
			.addField("Cancelling Prompts","Whenever GhostBot is prompting you for something, if you type `cancel` the prompt is cancelled and you can send messages without GhostBot using them!")
			.addField("Permissions","The first thing you want to do when you invite your bot is set permissions. To this use `/settings` and open the roles menu. There, select either admin or moderator and mention a role. Now whenever someone tries to use a command it checks to see if the user has that role.")
			.addField("Log Channel","Next thing you want to do when you get GhostBot is to set a log channel. GhostBot will log special events here. To do this use `/settings` and open the channels menu. There, select log channel and mention the channel you want GhostBot to send messages to.")
			.addField("Your all set!","Everything else on the `/settings` is optional.");
		channel.send({
			content: owner.toString(),
			embeds: [embed]
		});
	}
}