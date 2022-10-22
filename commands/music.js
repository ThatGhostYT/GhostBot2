const {SlashCommandBuilder} = require("@discordjs/builders");
const {PermissionFlagsBits: Permissions} = require("discord-api-types/v10");

module.exports = {
	name: "music",
	description: "GhostBot Music System.",
	slash: new SlashCommandBuilder()
		.setDefaultMemberPermissions(Permissions.Connect),
	callback(interaction,args,client){
		
	}
};