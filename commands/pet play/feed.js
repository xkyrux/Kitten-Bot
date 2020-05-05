const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');
const Pets = require('../../models/petPlay');
const Guild = require('../../models/guild');
const Neko = require('nekos.life');

module.exports = {
    name: "feed",
    category: "pet play",
    description: "Feeds the mentioned user. User must be your pet or have the your server's **Shared Role**.",
    usage: `${(process.env.PREFIX)}feed <@user>`,
    run: async (client, message, args) => {

        const member = await message.mentions.members.first();

        const guild = await Guild.findOne({
            guildID: message.guild.id
        })

        const neko = new Neko();
        const url = await neko.sfw.feed();

        const ownableRole = await message.guild.roles.fetch(guild.ownableRoleID);
        const petOwnersRole = await message.guild.roles.fetch(guild.petOwnersRoleID);
        const ownedRole = await message.guild.roles.fetch(guild.ownedRoleID);
        const sharedRole = await message.guild.roles.fetch(guild.sharedRoleID);

        if(!guild){
            const newGuild = new Guild({
                _id: mongoose.Types.ObjectId(),
                guildID: message.guild.id,
                guildName: message.guild.name,
                sharedRoleID: 'Role not set',
                ownableRoleID: 'Role not set',
                ownedRoleID: 'Role not set',
                petOwnersRoleID: 'Role not set'
            });
        
            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));

        } else {

            if(!ownableRole)
                return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));
            
            if(!petOwnersRole)
                return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));
            
            if(!ownedRole)
                return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));

            if(!sharedRole)
                return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));


            if (args < 1)
                return message.channel.send('You must mention a user to spank!').then(m => m.delete({timeout: 5000}));
    
            if (!member)
                return message.channel.send('I could not find that user, please make sure to mention a user **in this server**.').then(m => m.delete({timeout: 5000}));
    
            if (member.id === message.author.id)
                return message.channel.send('You cannot spank yourself!').then(m => m.delete({timeout: 5000}));
    
            if (member.user.bot)
                return message.channel.send('You cannot spank bots!').then(m => m.delete({timeout: 5000}));
        }

            
        const pet = await Pets.findOne({
            ownerID: message.author.id,
            guildID: message.guild.id,
            pet1: member.id
        });

        if(!pet){

            if(!member.roles.cache.has(sharedRole.id)) {
                return message.channel.send(`This user is either not your pet or they do not have the **${sharedRole.name}** role.`).then(m => m.delete({timeout: 10000}));
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setDescription(`${message.author} **fed** ${member}`)
                    .setImage(url.url);

                return message.channel.send(embed);
            };
        } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setDescription(`${message.author} **fed** ${member}`)
                    .setImage(url.url);

                return message.channel.send(embed);
        };

    }
};