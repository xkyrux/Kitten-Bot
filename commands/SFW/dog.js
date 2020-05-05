const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "dog",
    category: "SFW",
    description: "Sends a random picture of a dog.",
    usage: `${(process.env.PREFIX)}dog`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const url = await neko.sfw.woof();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setImage(url.url);

            message.channel.send(embed);



    }
}