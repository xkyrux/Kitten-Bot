const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "goose",
    category: "SFW",
    description: "Sends a random picture of a goose.",
    usage: `${(process.env.PREFIX)}goose`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const url = await neko.sfw.goose();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setImage(url.url);

            message.channel.send(embed);



    }
}