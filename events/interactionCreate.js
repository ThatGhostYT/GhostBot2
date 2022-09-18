module.exports = {
	name: "interactionCreate",
	once: false,
	callback(client,interaction){
		if(interaction.isCommand()){
			const command = client.commands.get(interaction.commandName);

			const args = [];

			for(const arg of interaction.options.data){
				if(arg.type == "SUB_COMMAND"){
					args.push(arg.name);
					for(const op of arg.options){
						args.push(op.value);
					}
				} else args.push(arg.value);
			}
			
			command.callback(client,interaction,args,true);
		} else if(interaction.isModalSubmit()){
			const prefix = interaction.fields.getTextInputValue("prefix");
			const embedColor = interaction.fields.getTextInputValue("embed-color");
			const log = interaction.fields.getTextInputValue("log-channel");
			const changes = [];

			if(prefix !== ""){
				if(!/[a-zA-Z\-;!\/,.\?:]/gi.test(prefix)) changes.push(":x: Prefix can only contain characters A to Z (uppercase and lowercase), and symbols `- ; ! / , . ? :`.\n");
				else client.db.set(`prefix-${interaction.guildId}`,prefix)
					.then(() => {
						changes.push(`Changed prefix to **${prefix}**.`);
					}).catch(() => {
						changes.push(":x: Error occurred while trying to change prefix. Try again later.");
					});
			}
			
			if(embedColor !== ""){
				if(!/^#([a-z0-9]{3}){1,2}$/gi.test(embedColor) && embedColor.toLowerCase() !== "default") changes.push(":x: Embed color must be a hex code or the word `default`.\n");
				else client.db.set(`embed-color-${interaction.guildId}`,embedColor.toLowerCase() === "default" ? "BLURPLE" : embedColor)
					.then(() => {
						changes.push(`Changed embed color to **${embedColor}**.`);
					}).catch(() => {
						changes.push(":x: Error occurred while trying to change prefix. Try again later.");
					});
			}

			if(log !== ""){
				const channel = interaction.guild.channels.cache.find((c) => c.name === log);
				if(!channel) changes.push(":x: A log channel was not mentioned.");
				else client.db.set(`log-channel-${interaction.guildId}`,channel.id)
					.then(() => {
						changes.push(`Changed log channel to <#${channel.id}>`);
						channel.send({
							content: "**This is the new GhostBot log channel.**"
						})
					}).catch(() => {
						changes.push(":x: Error occurred while trying to change log channel. Try again later.");
					});
			}

			setTimeout(() => interaction.reply({
				content: changes.length > 1 ? changes.join("\n") : changes[0],
				ephemeral: true
			}),500);
		}
	}
}