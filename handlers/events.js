module.exports = async (fs,client) => {
	const events = fs.readdirSync("./events")
		.filter(f => f.endsWith(".js"));

	for(const event of events){
		const e = require(`../events/${event}`);

		if(e.once){
			client.once(e.name,(...args) => e.callback(client,...args));
		} else{
			client.on(e.name,(...args) => e.callback(client,...args));
		}
	}
}