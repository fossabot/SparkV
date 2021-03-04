const Discord = require("discord.js");
const figlet = require("figlet")

exports.run = async (Bot, msg, Arguments) => {
  if (!Arguments || !Arguments[0]){
    return msg.channel.send("Please provide text!")
  }

  Arguments = Arguments.join(" ")

  figlet.text(Arguments, function(err, data){
    if (err){
      msg.channel.send("Uh oh! Something went wrong.")
      console.log("Failed to figlet text: " + err)

      return
    }

    if (data.length > 2000){
      return msg.channel.send("Please provide text shorter than 200 characters.")
    }

    msg.channel.send("```" + data + "```")
  })
},
  
  exports.config = {
    name: "Ascii",
    description: "I will change any text to ascii!",
    aliases: [],
    usage: "<text>",
    category: "😃fun😃",
    bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS", "VIEW_CHANNEL", "ADD_REACTIONS"],
    member_permissions: [],
    enabled: true,
    cooldown: 5
  }