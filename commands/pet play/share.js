const { MessageAttachment, MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');
const Pets = require('../../models/petPlay');
const Guild = require('../../models/guild');

const locked = new MessageAttachment('../../resources/locked.png');
const unlocked = new MessageAttachment('../../resources/unlocked.png');

module.exports = {
    name: "share",
    category: "pet play",
    description: "Shares yourself or the mentioned user so that others may user pet play commands on you or the mentioned user. Mentioned user must be your pet!",
    usage: `${(process.env.PREFIX)}share`,
    usage: `${(process.env.PREFIX)}share <@user>`,
    run: async (client, message, args) => {

        const member = await message.mentions.members.first();

        const guild = await Guild.findOne({
            guildID: message.guild.id
        })

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
        }

        const pet = await Pets.findOne({
            ownerID: message.author.id,
            guildID: message.guild.id
        });


        if (args[0]) {
            return hasMention(args[0]);
        } else {
            return noMention();
        }

        function hasMention() {
            if (!member) {
                return message.channel.send('I could not find that user, please make sure to mention a user **in this server**.').then(m => m.delete({timeout: 5000}));
            }

            if (member.id === message.author.id) {
                return message.channel.send(`If you want to share yourself, please just say \`${(process.env.PREFIX)}share\` without mentioning a user.`).then(m => m.delete({timeout: 10000}));
            }

            if (member.user.bot) {
                return message.channel.send('You share bots!').then(m => m.delete({timeout: 5000}));
            }

            if (pet.pet1 !== member.id) {
                return message.channel.send('You do not own this user!').then(m => m.delete({timeout: 5000}));
            } if (!member.roles.cache.has(sharedRole.id)) {
                
                member.roles.add(sharedRole);

                embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setDescription(`${message.author} is now sharing their pet ${member}`)

                    return message.channel.send(embed).then(m => m.delete({timeout: 5000}));
            } else {
                
                member.roles.remove(sharedRole);

                embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setDescription(`${message.author} is no longer sharing their pet ${member}`)

                    return message.channel.send(embed).then(m => m.delete({timeout: 5000}));
            }
        }

        function noMention() {

            if (message.member.roles.cache.has(ownedRole)) {
                return message.channel.send('You cannot share yourself while you are owned by someone else!').then(m => m.delete({timeout: 10000}));
            }

            if (!message.member.roles.cache.has(sharedRole.id)) {
                
                message.member.roles.add(sharedRole);

                embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setDescription(`${message.author} is now sharing themself.`)

                    return message.channel.send(embed).then(m => m.delete({timeout: 5000}));
            } else {
            
                message.member.roles.remove(sharedRole);

                embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setDescription(`${message.author} is no longer sharing themself.`)

                    return message.channel.send(embed).then(m => m.delete({timeout: 5000}));
            }
        }
    }
}