const {SlashCommandBuilder} = require("@discordjs/builders");
const fs = require("fs");

module.exports = (client) => {
	const slash = [];
	const commands = fs.readdirSync("./exclusive/")
		.filter(file => file.endsWith(".js"))
	for(const file of commands){
		/**
		 * @type {Command}
		 */
		const cmd = require(`../exclusive/${file}`);
		client.commands.set(cmd.name,cmd);
		console.log(`Exclusive Command ${cmd.name} loaded!`);
		
		const builder = new SlashCommandBuilder()
			.setName(cmd.name)
			.setDescription(`${cmd.description} Exclusive.`);
		cmd.slash.forEach(arg => {
			switch(arg.type){
				case "STRING":
					builder.addStringOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required);
						if(arg.choices){
							for(const choice of arg.choices){
								option.addChoice(choice.name,choice.value);
							}
						}
						return option;
					});
					break;

				case "INTEGER":
					builder.addIntegerOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						if(arg.choices){
							for(const choice of arg.choices){
								option.addChoice(choice.name,choice.value);
							}
						}
						return option;
					});
					break;

				case "NUMBER":
					builder.addNumberOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "BOOLEAN":
					builder.addBooleanOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "USER":
					builder.addUserOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "CHANNEL":
					builder.addChannelOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "ROLE":
					builder.addRoleOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;

				case "MENTIONABLE":
					builder.addMentionableOption(option => {
						option.setName(arg.name)
							.setDescription(arg.description)
							.setRequired(arg.required)
						return option;
					});
					break;
			}
		});

		slash.push(builder);
	}
	return slash;
}