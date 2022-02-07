const Discord = require("discord.js");

/**
 * @param {Discord.Interaction} interaction
 * @param {Discord.Interaction.options} args
 * @param {Discord.Client} client
 */
function CommandCallback(interaction,args,client,db){};

module.exports = class{
	/**
	 * @typedef {{name: string, description: string, required: boolean, type: Discord.ApplicationCommandOptionType, choices: Choice[]}} SlashCommandOptions
	 * @typedef {{name: string, description: string, permission: string, slash: SlashCommandOptions[], callback: CommandCallback}} CommandOptions
	 * @param {CommandOptions} options
	 */
	constructor(options){
		this.name = options.name;
		this.aliases = options.aliases;
		this.description = options.description;
		this.permission = options.permission;
		this.slash = options.slash;
		this.callback = options.callback;
	}
}