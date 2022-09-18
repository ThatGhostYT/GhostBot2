module.exports = {
	name: "guildDelete",
	callback(client,guild){
		client.user.presence.set({
			activities: [
				{
					name: `${client.guilds.cache.size} servers.`,
					type: "WATCHING"
				}
			]
		});

		client.db.delete(`embed-color-${guild.id}`);
		client.db.delete(`log-channel-${guild.id}`);
		client.db.delete(`prefix-${guild.id}`);
	}
}