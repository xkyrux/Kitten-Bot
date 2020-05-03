const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Displays the help message or one specific command's info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            return helpMSG(client, message);
        }
    }
}

function helpMSG(client, message) {
    const embed = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle('Kitten Bot Help')
        .setThumbnail(client.user.avatarURL())
        .setDescription(`For a full list of commands, please type \`${process.env.PREFIX}commands\` \n\nTo see more info about a specific command, please type \`${process.env.PREFIX}help <command>\` without the \`<>\``)
        .addField('About', `**${(client.user.username)}** is a full NSFW bot. Our main focus is handling pet play relationships between users in the same server as well as across different servers! \n\nYou can claim a user as your pet by using \`${(process.env.PREFIX)}claim <@user>\` and that user will be able to accept or not.\n\nAside from pet play, we also have NSFW commands for actions and images/gifs!`)
        .addField('Links', "[Our Discord Server](https://discord.gg/yxeSAhN) \n[Kitte Bot Support](https://discord.gg/6e5CuRt) \n[Invite Bot](https://discordapp.com/api/oauth2/authorize?client_id=605233561314000927&permissions=470150209&scope=bot)")
        .setFooter('Created by Sleepless Kyru#7615');
    message.channel.send(embed);
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor(process.env.COLOR).setDescription(info));
    }

    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.category) info += `\n**Category**: ${cmd.category}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: \n\`\`\`${cmd.usage}\`\`\``;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }
    if (cmd.usage2) info += `\n**Usage 2: \n\`\`\`${cmd.usage2}\`\`\``;

    return message.channel.send(embed.setColor(process.env.COLOR).setDescription(info));
}