const Discord = require("discord.js");

/**
 * @param {Discord.Message | Discord.Interaction} message
 * @param {string[]} args
 * @param {Discord.Client} client
 */
function CommandCallback(message,args,client){};

module.exports = class{
	/**
	 * @typedef {{name: string, description: string, required: boolean, type: Discord.ApplicationCommandOptionType, choices: Choice[]}} SlashCommandOptions
	 * @typedef {{description: string, category: string, syntax: string}} Details
	 * @typedef {{name: string, aliases: string[], details: Details, slash: SlashCommandOptions[], callback: CommandCallback}} CommandOptions
	 * @param {CommandOptions} options
	 */
	constructor(options){
		this.name = options.name;
		this.aliases = options.aliases;
		this.details = options.details;
		this.slash = options.slash;
		this.callback = options.callback;
	}
}