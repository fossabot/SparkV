const Discord = require("discord.js");

exports.run = async (Bot, msg, Arguments) => {
  if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
    return msg.channel.send("You don't have permision to run this command!").then(m => m.delete({ timeout: 5000 }))
  }

  Arguments = Arguments.join(" ")

  msg
    .delete()
    .catch(_ => {});
  
  msg.channel.send(Arguments + "\n*-" + msg.author.username + "*")
},
  
exports.config = {
    enabled: true,
    guild_only: true,
    aliases: ["talk"],
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL", "MANAGE_MESSAGES"]
  },
  
  exports.help = {
    name: "Say",
    description: "I will say whatever you want me to say.",
    usage: "[message]",
    category: "😃fun😃",
    cooldown: 5
  }