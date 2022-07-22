/* eslint-disable no-case-declarations */
import Discord, { Colors } from "discord.js";

export default {
	once: false,
	async execute(bot: any, reaction: any, user: any) {
		/* -------------------------------------------------- PARTIALS --------------------------------------------------*/
		if (reaction?.partial) await reaction?.fetch().catch((): any => { });
		if (reaction.message?.partial) await reaction?.message?.fetch().catch((): any => { });

		const message = reaction.message;
		const data = await bot.database.getGuild(message.guildId);

		/* -------------------------------------------------- HANDLE --------------------------------------------------*/
		switch (reaction.emoji.name) {
			case data.starboard?.emoji || "⭐": {
				/* -------------------------------------------------- STARBOARD --------------------------------------------------*/
				if (data.starboard?.enabled === "true") {
					if ((reaction.count >= (parseInt(data.starboard?.min) || 2)) === false) return;

					const channel = message.guild.channels.cache.find((c: Discord.TextBasedChannel) => c.id === data.starboard?.channel);
					if (!channel) return;

					let fetchedMessages = await channel.messages.fetch({ limit: 100 });
					fetchedMessages = fetchedMessages.filter((m: Discord.Message) => {
						if (m?.embeds?.length > 0) return true;
						else return false;
					});

					/* -------------------------------------------------- SEND/EDIT MESSAGE --------------------------------------------------*/
					const stars = fetchedMessages.find((m: Discord.Message) => m.embeds[0]?.description?.includes(message.url));
					if (stars) {
						const foundStar = stars.embeds[0];
						const msg = await channel.messages.fetch(stars.id);

						await msg.edit({
							embeds: [{
								author: { name: message.author.tag, icon_url: message.author.displayAvatarURL() },
								description: `[${message.channel.name}](${message.url}) | ${data.starboard?.emoji} **${reaction.count}**${foundStar?.description.includes("\n\n") ? `\n\n${foundStar?.description.split(`\n\n`)[1]}` : ""}`,
								image: { url: message.attachments.first()?.url || null },
								color: foundStar.color,
								timestamp: new Date()
							}]
						}).catch((): any => { });
					} else {
						await channel?.send({
							embeds: [{
								author: { name: message.author.tag, icon_url: message.author.displayAvatarURL() },
								description: `[${message.channel.name}](${message.url}) | ${data.starboard?.emoji} **${reaction.count}**${message?.content ? `\n\n${message?.content}` : ""}`,
								image: { url: message.attachments.first()?.url || null },
								color: Colors.Blue,
								timestamp: new Date()
							}]
						}).catch((): any => {});
					}
				}
			}
		}
	}
};
