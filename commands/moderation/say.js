const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    description: "Says your input via the bot",
    usage: `${(process.env.PREFIX)}say [embed] <INPUT>`,
    run: (client, message, args) => {
        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.channel.send("You don't have the required permissions to use this command.").then(m => m.delete({timeout: 5000}));

        if (args.length < 1)
            return message.channel.send("You must specify something for the bot to say.").then(m => m.delete({timeout: 5000}));

        if (args[0].toLowerCase() === "embed") {
            const embed = new MessageEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(process.env.COLOR);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}