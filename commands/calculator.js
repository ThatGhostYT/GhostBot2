const {SlashCommandBuilder} = require("@discordjs/builders");

const {
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
	InteractionCollector
} = require("discord.js");

const Embed = require("../components/createEmbed.js");

const {evaluate,pi} = require("mathjs");

module.exports = {
	name: "calculator",
	aliases: [],
	description: "Send a digital calculator.",
	slash: new SlashCommandBuilder(),
	async callback(client,interaction,args,ephemeral){
		let equation = "";
		const embed = (await Embed(client,interaction.guild))
			.setTitle("Calculator")
			.setDescription("Use the keypad below to edit the equation.")
			.addFields({
				name: "Equation",
				value: "```diff\n+ Use the keypad below to edit the equation.\n```"
			});

		interaction.reply({
			embeds: [embed],
			ephemeral,
			components: [
				new MessageActionRow().addComponents([
					new MessageButton()
						.setCustomId("ac")
						.setLabel("AC")
						.setStyle("DANGER"),
					new MessageButton()
						.setCustomId("del")
						.setLabel("DEL")
						.setStyle("DANGER"),
					new MessageButton()
						.setCustomId("exit")
						.setLabel("EXIT")
						.setStyle("DANGER"),
					new MessageButton()
						.setCustomId("(")
						.setLabel("(")
						.setStyle("PRIMARY"),
					new MessageButton()
						.setCustomId(")")
						.setLabel(")")
						.setStyle("PRIMARY"),
				]),
				new MessageActionRow().addComponents([
					new MessageButton()
						.setCustomId("1")
						.setLabel("1")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("2")
						.setLabel("2")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("3")
						.setLabel("3")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("+")
						.setLabel("+")
						.setStyle("PRIMARY"),
					new MessageButton()
						.setCustomId("-")
						.setLabel("-")
						.setStyle("PRIMARY"),
				]),
				new MessageActionRow().addComponents([
					new MessageButton()
						.setCustomId("4")
						.setLabel("4")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("5")
						.setLabel("5")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("6")
						.setLabel("6")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("*")
						.setLabel("*")
						.setStyle("PRIMARY"),
					new MessageButton()
						.setCustomId("/")
						.setLabel("/")
						.setStyle("PRIMARY"),
				]),
				new MessageActionRow().addComponents([
					new MessageButton()
						.setCustomId("7")
						.setLabel("7")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("8")
						.setLabel("8")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("9")
						.setLabel("9")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("%")
						.setLabel("%")
						.setStyle("PRIMARY"),
					new MessageButton()
						.setCustomId("^")
						.setLabel("^")
						.setStyle("PRIMARY"),
				]),
				new MessageActionRow().addComponents([
					new MessageButton()
						.setCustomId(".")
						.setLabel(".")
						.setStyle("PRIMARY"),
					new MessageButton()
						.setCustomId("0")
						.setLabel("0")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("00")
						.setLabel("00")
						.setStyle("SECONDARY"),
					new MessageButton()
						.setCustomId("=")
						.setLabel("=")
						.setStyle("SUCCESS"),
					new MessageButton()
						.setCustomId("adv")
						.setLabel("ADV")
						.setStyle("SECONDARY"),
				]),
			]
		});

		const collector = new InteractionCollector(client,{
			idle: 15 * 60 * 1000,
			filter: i => i.author === interaction.author,
			channel: interaction.channel,
			guild: interaction.guild
		});

		collector.on("end",async () => interaction.editReply({
			embeds: [
				(await Embed(client,interaction.guild))
					.setTitle("Calculator")
					.setDescription("Process Exited")
			],
			components: []
		}));

		let answered = false;
		collector.on("collect",async i => {
			switch(i.customId){
				case "ac":
					answered = false;
					equation = "";
					i.update({
						embeds: [
							(await Embed(client,interaction.guild))
								.setTitle("Calculator")
								.setDescription("Use the keypad below to edit the equation.")
								.addFields({
									name: "Equation",
									value: "```diff\n+ Equation Cleared!\n```"
								})
						]
					});
					break;

				case "del":
					answered = false;
					equation = equation.slice(0,-1);
					i.update({
						embeds: [
							(await Embed(client,interaction.guild))
								.setTitle("Calculator")
								.setDescription("Use the keypad below to edit the equation.")
								.addFields({
									name: "Equation",
									value: equation.length === 0
										? "```diff\n+ Use the keypad below to edit the equation.\n```"
										: `\`\`\`\n${equation}\n\`\`\``
								})
						]
					});
					break;

				case "exit":
					collector.stop();
					break;

				case "=":
					let success = true;
					try{
						equation = evaluate(equation,{
							"π": pi
						}).toString();
						answered = true;
						i.update({
							embeds: [
								(await Embed(client,interaction.guild))
									.setTitle("Calculator")
									.setDescription("Use the keypad below to edit the equation.")
									.addFields({
										name: "Equation",
										value: `\`\`\`\n${equation}\n\`\`\``
									})
							]
						});
					} catch(e){
						i.update({
							embeds: [
								(await Embed(client,interaction.guild))
									.setTitle("Calculator")
									.setDescription(`Oops! Looks like an error occurred when trying to solve that equation.\n\`${e}\``)
									.addFields({
										name: "Equation",
										value: `\`\`\`\n${equation}\n\`\`\``
									})
							]
						})
					}
					break;

				case "adv":
					i.reply({
						content: "Pick an advanced mathematical number/function.",
						components: [
							new MessageActionRow().addComponents([
								new MessageSelectMenu()
									.setCustomId("adv-menu")
									.setPlaceholder("None Selected.")
									.addOptions(
										{
											label: "Sine",
											value: "sin(",
											description: "The ratio of the length of the opposite side to that of the hypotenuse in a right-angled triangle."
										},
										{
											label: "Cosine",
											value: "cos(",
											description: "The length of the adjacent side divided by the length of the hypotenuse."
										},
										{
											label: "Tangent",
											value: "tan(",
											description: "The length of the side of a right triangle that is adjacent to an acute angle."
										},
										{
											label: "Square Root",
											value: "sqrt(",
											description: "A factor of a number that, when multiplied by itself, gives the original number."
										},
										{
											label: "π (pi)",
											value: "π",
											description: "The ratio of the circumference of a circle to its diameter."
										},
										{
											label: "Euler's Number (e)",
											value: "e",
											description: "A mathematical expression for the base of the natural logarithm."
										},
										{
											label: "Absolute Value",
											value: "abs(",
											description: "Distance between a number and 0 on a number line."
										},
										{
											label: "Imaginary Unit (i)",
											value: "i",
											description: "A number whose square is equal to -1."
										}
									)
							])
						],
						ephemeral: true
					});
					break;

				case "adv-menu":
					if(answered){
						answered = false;
						equation = i.values[0];
					} else equation += i.values[0];
					interaction.editReply({
						embeds: [
							(await Embed(client,interaction.guild))
								.setTitle("Calculator")
								.setDescription("Use the keypad below to edit the equation.")
								.addFields({
									name: "Equation",
									value: `\`\`\`\n${equation}\n\`\`\``
								})
						]
					});
					i.deferUpdate();
					break;

				default:
					if(answered){
						answered = false;
						if(["+","-","*","/","%","^"].includes(i.customId)) equation += i.customId;
						else equation = i.customId;
					} else equation += i.customId;
					i.update({
						embeds: [
							(await Embed(client,interaction.guild))
								.setTitle("Calculator")
								.setDescription("Use the keypad below to edit the equation.")
								.addFields({
									name: "Equation",
									value: `\`\`\`\n${equation}\n\`\`\``
								})
						]
					});
			}
		});
	}
}