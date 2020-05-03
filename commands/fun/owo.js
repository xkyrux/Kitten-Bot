const { MessageEmbed } = require('discord.js');
const Neko = require('nekos.life');

module.exports = {
    name: "owo",
    category: "fun",
    description: "owoifies your text.",
    usage: `${(process.env.PREFIX)}owo <text>`,
    run: async (client, message, args) => {
        const neko = new Neko();
        const owo = await neko.sfw.OwOify({text: args.slice(1).join(" ")});
            console.log(owo);
        await message.delete();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('OwOify')
            .setDescription(owo.owo);

            message.channel.send(embed);



    }
}