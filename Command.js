const Discord = require("discord.js");

/**
 * @param {Discord.Message | Discord.Interaction} message
 * @param {string[]} args
 * @param {Discord.Client} client
 */
function CommandCallback(message,args,client){};

module.exports = class{
	/**
	 * @typedef {{name: string, description: string, callback: CommandCallback}} CommandOptions
	 * @param {CommandOptions} options
	 */
	constructor(options){
		this.name = options.name;
		this.description = options.description;
		this.callback = options.callback;
	}
}