module.exports = (fs,client) => {
	const commands = [];
	const table = {};
	
	const files = fs.readdirSync("./commands/")
		.filter(f => f.endsWith(".js"));

	for(const command of files){
		const c = require(`../commands/${command}`);
		client.commands.set(c.name,c);

		table[c.name] = {loaded: true};
		
		commands.push(c.slash
			.setName(c.name)
			.setDescription(c.description)
			.toJSON()
		);
	}

	console.table(table);
	return commands;
}