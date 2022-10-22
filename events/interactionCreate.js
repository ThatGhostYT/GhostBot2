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
			const embedColor = interaction.fields.getTextInputValue("embed-color");
			const changes = [];
			
			if(embedColor !== ""){
				if(!/^#([a-z0-9]{3}){1,2}$/gi.test(embedColor) && embedColor.toLowerCase() !== "default") changes.push(":x: Embed color must be a hex code or the word `default`.\n");
				else{
					try{
						client.db.set(`embed-color-${interaction.guildId}`,embedColor.toLowerCase() === "default" ? "BLURPLE" : embedColor);
						changes.push(`Changed embed color to **${embedColor}**.`);
					} catch(e){
						changes.push(":x: Error occurred while trying to change embed color. Try again later.");
						console.error(e);
					}
				}
			}

			setTimeout(() => interaction.reply({
				content: changes.length === 0
					? "Nothing was changed."
					: changes.length > 1
						? changes.join("\n")
						: changes[0],
				ephemeral: true
			}),500);
		}
	}
}