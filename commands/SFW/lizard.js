const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "lizard",
    category: "SFW",
    description: "Sends a random picture of a lizard.",
    usage: `${(process.env.PREFIX)}lizard`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const url = await neko.sfw.lizard();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setImage(url.url);

            message.channel.send(embed);



    }
}