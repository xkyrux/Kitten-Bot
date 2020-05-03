const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "hentai",
    category: "hentai",
    description: "Sends a random hentai image.",
    usage: `${(process.env.PREFIX)}hentai`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const url = await neko.nsfw.hentai();

        if(!message.channel.nsfw) {
            return message.channel.send('❌NSFW commands can only be used in channels marked as NSFW').then(m => m.delete({timeout: 10000}));
        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('Click here if you cannot see the image/gif')
                .setURL(url.url)
                .setImage(url.url);

                message.channel.send(embed);
        }
    }
}