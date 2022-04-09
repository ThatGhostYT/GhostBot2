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
		client.db.delete(`welcome-channel-${guild.id}`);
		client.db.delete(`moderator-${guild.id}`);
		client.db.delete(`admin-${guild.id}`);
		client.db.delete(`member-${guild.id}`);
		client.db.delete(`dj-${guild.id}`);

		guild.members.cache.forEach((v,k) => {
			client.db.delete(`warnings-${k}-${guild.id}`);
		});
	}
}