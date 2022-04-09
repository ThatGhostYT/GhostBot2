const Command = require("../Command.js");

module.exports = new Command({
	name: "purge",
	description: "Deletes a mass number of messages at once.",
	permission: "admin",
	slash: [
		{
			name: "number",
			description: "number of messages to delete",
			required: true,
			type: "INTEGER"
		}
	],
	async callback(interaction,args,client){
		let num = args.getInteger("number");

		if(isNaN(num) || num < 2 || num > 200) return interaction.reply({
			content: "Number must be between 2 and 200.",
			ephemeral: true
		});

		if(num > 100){
			num -= 100;

			interaction.channel.bulkDelete(num);
			interaction.channel.bulkDelete(100);

			interaction.reply("Successfully purged!");
		} else{
			interaction.channel.bulkDelete(num);

			interaction.reply("Successfully purged!");
		}
	}
});