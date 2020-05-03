const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "waifu",
    category: "SFW",
    description: "Sends a random picture of a waifu.",
    usage: `${(process.env.PREFIX)}waifu`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const url = await neko.sfw.waifu();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setImage(url.url);

            message.channel.send(embed);



    }
}