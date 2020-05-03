const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');
const Pets = require('../../models/petPlay');
const Guild = require('../../models/guild');

module.exports = {
    name: "claim",
    category: "pet play",
    description: "Requsts to claim the mentioned as your pet",
    usage: `${(process.env.PREFIX)}claim <@user>`,
    run: async (client, message, args) => {

        const member = await message.mentions.members.first();

        const filter = m => m.author.id === member.id;

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


            if (args < 1)
                return message.channel.send('You must mention a user to claim as your pet!').then(m => m.delete({timeout: 5000}));
    
            if (!member)
                return message.channel.send('I could not find that user, please make sure to mention a user **in this server**.').then(m => m.delete({timeout: 5000}));
    
            if (member.id === message.author.id)
                return message.channel.send('You cannot claim yourself!').then(m => m.delete({timeout: 5000}));
    
            if (member.user.bot)
                return message.channel.send('You cannot claim bots!').then(m => m.delete({timeout: 5000}));
    
            if(member.roles.cache.has(ownedRole.id))
                return message.channel.send(`This user is already owned in this server! You cannot claim users with the **${ownedRole.name}** role.`).then(m => m.delete({timeout: 10000}));
            
            if(!member.roles.cache.has(ownableRole.id))
                return message.channel.send(`This user is not ownable in this server! You can only claim users with the **${ownableRole.name}** role.`).then(m => m.delete({timeout: 10000}));
        }

            
        const pet = await Pets.findOne({
            ownerID: message.author.id,
            guildID: message.guild.id
        });

        if(!pet){

                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Pet Claim Request!')
                    .setThumbnail(member.user.avatarURL())
                    .setDescription(`**${(message.author)}** is requesting to claim **${member}** as their pet!`)
                    .addField('Accept or Decline?', 'Please respond with **accept** or **decline**... \nRequest expires in 60 seconds');

                    message.channel.send(embed).then(e => e.delete({timeout: 60000}));
                    message.channel.awaitMessages(filter, {max: 1, time: 60000}).then(collected => {

                        let response = collected.first().content;

                        if (response.toLowerCase() === 'accept') {

                            const newPet = new Pets({
                                _id: mongoose.Types.ObjectId(),
                                ownerID: message.author.id,
                                guildID: message.guild.id,
                                pet1: member.id
                            })
                
                            newPet.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));

                            message.member.roles.add(petOwnersRole);
                            member.roles.remove(ownableRole);
                            member.roles.add(ownedRole);

                            return message.channel.send(`Claim request **accepted**! ${member} is now ${(message.author)}'s pet!`).then(a => a.delete({timeout: 10000}));
                        }

                        if (response.toLowerCase() === 'decline') {
                            return message.channel.send(`${member} has declined the pet claim request from ${(message.author)}...`).then(d => d.delete({timeout: 10000}));
                        }

	}); 
        }

        else {
            if (pet.pet1 !== 'No pet') {
                return message.channel.send('You already have a pet in this server!').then(m => m.delete({timeout: 5000}));
            }

            if (pet.pet1 === 'No pet') {
                {

                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Pet Claim Request!')
                        .setThumbnail(member.user.avatarURL())
                        .setDescription(`**${(message.author)}** is requesting to claim **${member}** as their pet!`)
                        .addField('Accept or Decline?', 'Please respond with **accept** or **decline**... \nRequest expires in 60 seconds');
    
                        message.channel.send(embed).then(e => e.delete({timeout: 60000}));
                        message.channel.awaitMessages(filter, {max: 1, time: 60000}).then(collected => {
    
                            let response = collected.first().content;
    
                            if (response.toLowerCase() === 'accept') {
    
                                    pet.updateOne({
                                    ownerID: message.author.id,
                                    guildID: message.guild.id,
                                    pet1: member.id
                                })
                                    .then(result => console.log(result))
                                    .catch(err => console.error(err));
    
                                    message.member.roles.add(petOwnersRole);
                                    member.roles.remove(ownableRole);
                                    member.roles.add(ownedRole);
    
                                    return message.channel.send(`Claim request **accepted**! ${member} is now ${(message.author)}'s pet!`).then(a => a.delete({timeout: 10000}));
                            }
    
                            if (response.toLowerCase() === 'decline') {
                                return message.channel.send(`${member} has declined the pet claim request from ${(message.author)}...`).then(d => d.delete({timeout: 10000}));
                            }
    
                        }); 
                    }
                }
            }
        }
    }