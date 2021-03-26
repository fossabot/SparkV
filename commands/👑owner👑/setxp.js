const Discord = require("discord.js");
const Levels = require("discord-xp")

exports.run = async (Bot, message, Arguments) => {
  if (message.author.id !== process.env.OwnerID) {
    return message.channel.send("❌Access denied.")
  }

  const User = message.mentions.users.first() || Bot.users.cache.get(Arguments[0])
  const Leveling = await Bot.Database.get(`ServerData.${message.guild.id}.Leveling`)

  if (!Leveling || !Leveling === "on") {
    return message.channel.send("Leveling is not enabled for this server. Please enable it by doing `(prefix)Leveling on`!")
  }

  try {
    await Levels.setXp(User.id, message.guild.id, Arguments[1]).then(() => {
      message.channel.send(`Successfully set ${User}'s XP to ${await Bot.FormatNumber(Arguments[1])}!`)
    })
  } catch (err) {
    message.channel.send(`Error setting ${User}'s XP to ${await Bot.FormatNumber(Arguments[1])}.`)
  }
},

exports.config = {
  name: "SetXP",
  description: "Set XP.",
  aliases: [],
  usage: "<Ammount>",
  category: "👑owner👑",
  bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  member_permissions: [],
  enabled: true,
  cooldown: 2.5
}