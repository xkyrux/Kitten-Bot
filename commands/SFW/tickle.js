const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "tickle",
    category: "SFW",
    description: "Tickles the mentioned user.",
    usage: `${(process.env.PREFIX)}tickle <@user>`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const url = await neko.sfw.tickle();

        if (args < 1) {
            return message.channel.send('You must mention a user to tickle.').then(m => m.delete({timeout: 5000}));
        }

        const member = await message.mentions.members.first();

        if (!member) {
            return message.channel.send('I cannot find that user, please make sure you mention a user in the server.').then(m => m.delete({timeout: 10000}));
        } 
        
        if (member.id === message.author.id) {
            const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setDescription(`${(message.author)} **tickled** themself?? 🤔`)
            .setImage(url.url);

            message.channel.send(embed);
        } else {
            const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setDescription(`${(message.author)} **tickled** ${member} 😊`)
            .setImage(url.url);

            message.channel.send(embed);
        }



    }
}