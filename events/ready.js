module.exports = {
	name: "ready",
	once: true,
	callback(client){
		console.log("online");
		client.user.presence.set({
			activities: [
				{
					name: `${client.guilds.cache.size} servers.`,
					type: "WATCHING"
				}
			]
		});
	}
}