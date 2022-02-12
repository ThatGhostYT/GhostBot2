const Command = require("../Command.js");

module.exports = new Command({
	name: "cleardatabase",
	description: "Clears the database, only the creator of ghostbot can use this.",
	slash: [],
	callback(interaction,args,client,db,embedColor){
		if(!interaction.user.id === "797291470457274378")
			return interaction.reply({
				content: "Only the creator of ghostbot can use this command.",
				ephemeral: true
			});
		db.empty();
		interaction.reply({
			content: "Successfully cleared database.",
			ephemeral: true
		});
	}
});