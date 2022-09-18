module.exports = {
	name: "messageCreate",
	once: false,
	async callback(client,message){
		const prefix = await client.db.get(`prefix-${message.guildId}`) || "!";
		
		if(message.author.bot) return;
		if(!message.content.startsWith(prefix)) return;
		
		const args = message.content.slice(prefix.length).split(/ +/);
		const cmd = args.shift().toLowerCase();
		const command = client.commands.get(cmd) || client.commands.find(a => a.aliases.includes(cmd));
		
		if(!command){
			message.reply({
				content: `Command **${cmd}** does not exist.`
			});
		} else if(command.slashOnly){
			message.reply({
				content: `Command **${cmd}** can only be ran as a slash command.`
			});
		} else{
			command.callback(client,message,args,false);
		}
	}
}