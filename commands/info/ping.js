const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        const msg = await message.channel.send(`🏓 Pinging....`);

        const embed = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle('🏓 Pong!')
        .setDescription(`Latency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)} ms \nAPI Latency is ${Math.round(client.ws.ping)} ms`);
        
        message.channel.send(embed);
    }
}
