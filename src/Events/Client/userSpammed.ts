import Discord from "discord.js";

export default {
	once: false,
	async execute(bot: any, message: any, data: any) {
		if (data?.logging?.enabled === "true") {
			const channel = message.channel?.guild?.channels?.cache.get(data.logging?.channel);
			if (!channel) return;

			const embed = new Discord.MessageEmbed()
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL({ dynamic: true })
				})
				.setDescription(`${bot.config.emojis.alert} | **${message.author} has Spammed!**\n\n${bot.config.emojis.id} | **ID:** ${message.author.id}`)
				.setColor("RED")
				.setTimestamp();

			await channel.send({
				embeds: [embed]
			}).catch((): any => { });
		}
	}
};
