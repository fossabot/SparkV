const Discord = require("discord.js");

exports.run = async (bot, message, args, command, data) => {
    try {
        message.guild.roles.cache.forEach((role) => {
            message.channel.createOverwrite(role, {
                SEND_MESSAGES: true,
            });
        });
    } catch (err) {}

    message.reply(
        `${bot.config.bot.Emojis.success} | Channel is now unlocked.`
    );
};

exports.config = {
    name: "Unlock",
    description: "I'll unlock the current channel.",
    aliases: [],
    usage: "",
    category: "🛠️Moderation🛠️",
    bot_permissions: [
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "VIEW_CHANNEL",
        "MANAGE_CHANNELS",
    ],
    member_permissions: ["MANAGE_CHANNELS"],
    enabled: true,
    cooldown: 5,
};
