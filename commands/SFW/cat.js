const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "cat",
    category: "SFW",
    description: "Sends a random picture of a cat.",
    usage: `${(process.env.PREFIX)}cat`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const url = await neko.sfw.meow();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setImage(url.url);

            message.channel.send(embed);



    }
}