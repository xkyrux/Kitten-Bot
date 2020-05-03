const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');
const Pets = require('../../models/petPlay');
const Guild = require('../../models/guild');

module.exports = {
    name: "unclaim",
    category: "pet play",
    description: "Unclaims your current pet in the server that you typed the command in.",
    usage: `${(process.env.PREFIX)}unclaim`,
    run: async (client, message, args) => {

        const member = await message.mentions.members.first();

        const filter = m => m.author.id === message.author.id;

        const guild = await Guild.findOne({
            guildID: message.guild.id
        });

        const pet = await Pets.findOne({
            ownerID: message.author.id,
            guildID: message.guild.id
        });

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
        } 

        if(!ownableRole)
            return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));
            
        if(!petOwnersRole)
            return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));
            
        if(!ownedRole)
            return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));

        if(!sharedRole)
            return message.channel.send(`This server does not have the roles I require to run properly. Please run the \`${(process.env.PREFIX)}setup\` command to set up the roles I need!`).then(m => m.delete({timeout: 10000}));
            
        
        if (args < 1) {
            return message.channel.send('You must mention the pet you want to unclaim.');
        }

        if(pet.pet1 === 'No pet') {
            return message.channel.send('You do not own any pets in this server.');
        } 

        const currentPet = await message.guild.members.fetch(pet.pet1)

        if(!currentPet) {
            pet.updateOne({
                pet1: 'No pet'
            })
            .then(result => console.log(result))
            .catch(err => console.error(err));

            return message.channel.send('It seems the pet you owned is no longer in the server so we unclaimed them for you!').then(m => m.delete({timeout: 10000}));
        }

        if(pet.pet1 !== member.id) {
            return message.channel.send(`You do not own this user! Your current pet in this server is **${currentPet.user.username}**`).then(m => m.delete({timeout: 10000}));
        }

        message.channel.send(`Are you sure you want to unclaim **${currentPet.user.username}** as your pet? *(yes/no)*`).then(r => r.delete({timeout: 20000}));
        message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {

            let response = collected.first().content;

            if (response.toLowerCase() === 'yes') {

                pet.updateOne({
                    pet1: 'No pet'
                })
                .then(result => console.log(result))
                .catch(err => console.error(err));

                message.member.roles.remove(petOwnersRole);
                member.roles.remove(ownedRole);
                member.roles.remove(sharedRole);
                member.roles.add(ownableRole);

                return message.channel.send('Pet unclaimed!').then(m => m.delete({timeout: 5000}));
            }

            if (response.toLowerCase() === 'no') {
                return message.channel.send(`Unclaim cancelled! **${currentPet.user.username}** will remain as your pet.`);
            }
        })
    }
}