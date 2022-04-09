const {MessageEmbed,MessageCollector} = require("discord.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const Command = require("../Command.js");

module.exports = new Command({
	name: "wordle",
	description: "Play wordle on discord!",
	permission: "",
	slash: [],
	async callback(interaction,args,client){
		const embed = new MessageEmbed({
			color: await client.db.get(`embed-color-${interaction.guildId}`)
		})
			.setTitle("How to play?")
			.setDescription("You have 6 chances to guess a random 5 letter word.\n\n:green_square: - Your letter is correct and in the right spot!\n:yellow_square: - Your letter is in the word but in the wrong spot.\n:red_square: - Your letter is not in the word.\n\nSay \`reveal\` to stop the game and reveal the word.");
		interaction.reply({
			embeds: [embed],
			ephemeral: true
		});

		const answers = await fetch("https://fly.wordfinderapi.com/api/search?length=5&page_size=500")
			.then(res => res.json())
			.then(data => {
				const list = [];
				for(const page of data.word_pages){
					for(const {word} of page.word_list){
						list.push(word);
					}
				}
				return list;
			});
		const wordList = await fetch("https://fly.wordfinderapi.com/api/search?length=5&page_token=2&page_size=100000&word_sorting=points&group_by_length=true&dictionary=all_en")
			.then(res => res.json())
			.then(data => {
				const list = [];
				for(const page of data.word_pages){
					for(const {word} of page.word_list){
						list.push(word);
					}
				}
				return list;
			});
		const collector = new MessageCollector(interaction.channel,{
			filter: (m) => m.author.id === interaction.user.id
		});

		const whitelist = /[A-Za-z]+/;
		const word = answers[Math.floor(Math.random() * answers.length)];

		let tries = 6;
		collector.on("collect",(message) => {
			if(message.content.toLowerCase() === "reveal"){
				collector.stop();
				return message.reply(`The word was **${word}**.`);
			}
			
			if(message.content.length !== 5) return message.reply(`Your word must have 5 letters! **${tries}** tries left!`);
			if(!whitelist.test(message.content)) return message.reply(`Make sure you only have letters in your word! **${tries}** tries left!`);
			if(!wordList.includes(message.content.toLowerCase())) return message.reply(`**${message.content}** is not a valid word! **${tries}** tries left!`);
			
			let squares = "";
			for(let i = 0; 5 > i; i++){
				const guessi = message.content.toLowerCase().split("")[i];
				const wordi = word.toLowerCase().split("")[i];
				
				if(guessi === wordi){
					squares += ":green_square: ";
				} else if(word.includes(guessi)){
					squares += ":yellow_square: ";
				} else{
					squares += ":red_square: ";
				}
			}

			let content = "";
			if(squares === ":green_square: :green_square: :green_square: :green_square: :green_square: "){
				collector.stop();
				content = `**${message.content.toUpperCase().split("").join(" ")}**\n${squares}\nCongratulations! Guessed with **${tries}** guesses remaining!`;
			} else{
				if(tries === 0){
					collector.stop();
					content = `**${message.content.toUpperCase().split("").join(" ")}**\n${squares}\nThe word was **${word}**.`;
				} else{
					content = `**${message.content.toUpperCase().split("").join(" ")}**\n${squares}\n**${tries}** tries left! Try Again!`;
				}
			}

			message.reply({
				content
			});
			tries--;
		});
	}
});