const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: "setup",
    category: "moderation",
    description: "Sets up server roles that the bot **NEEDS** in order to work properly. You may change these role names at anytime after they are made.",
    usage: `${(process.env.PREFIX)}setup`,
    run: async (client, message, args) => {
         await message.delete();

        const filter = m => m.author.id === message.author.id;
        if (!message.member.hasPermission("MANAGE_GUILD"))
            return message.channel.send("You don't have the required permissions to use this command.").then(r => r.delete({timeout: 5000}));

        message.channel.send('Are you sure you want to run the setup? This will overwrite roles from a previous setup. *(request expires in 20 seconds)*').then(r => r.delete({timeout: 10000}));
        message.channel.awaitMessages(filter, {max: 1, time: 20000}).then(collected => {

            let response = collected.first().content;

            if (response.toLowerCase() === 'yes') {
                message.channel.send('Setting up, please wait a moment...').then(async r2 => {
                   
                   
                    const ownable = await message.guild.roles.create({data:{
                        name: 'Ownable',
                        color: '#26ff00',
                        hoist: 'false',
                        position: '1',
                        mentionable: 'false'
                    }})

                    const owned = await message.guild.roles.create({data:{
                        name: 'Owned',
                        color: '#ff0000',
                        hoist: 'false',
                        position: '1',
                        mentionable: 'false'
                    }})

                    const petOwner = await message.guild.roles.create({data:{
                        name: 'Pet Owner',
                        color: '#0091ff',
                        hoist: 'false',
                        position: '1',
                        mentionable: 'false'
                    }})

                    const shared = await message.guild.roles.create({data:{
                        name: 'Shared',
                        color: '#ff99e6',
                        hoist: 'false',
                        position: '1',
                        mentionable: 'false'
                    }})
                    
                    Guild.findOne({
                        guildID: message.guild.id
                    }, (err, guild) => {
                        if(err) console.error(err);
                        if(!guild){
                            const newGuild = new Guild({
                                _id: mongoose.Types.ObjectId(),
                                guildID: message.guild.id,
                                guildName: message.guild.name,
                                sharedRoleID: shared.id,
                                ownableRoleID: ownable.id,
                                ownedRoleID: owned.id,
                                petOwnersRoleID: petOwner.id
                            })
                            
                            newGuild.save()
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
        
                        } else {
                            guild.updateOne({
                                sharedRoleID: shared.id,
                                ownableRoleID: ownable.id,
                                ownedRoleID: owned.id,
                                petOwnersRoleID: petOwner.id
                            })
                            .then(result => console.log(result))
                            .catch(err => console.error(err));
                        }
                    })

                    r2.edit('Setup complete!').then(r2.delete({timeout: 5000}));
                })
            }

            if (response.toLowerCase() === 'no') {
               return message.channel.send('Setup has been cancelled!').then(r2 => r2.delete({timeout: 5000}));
            }
})

        .catch(err => {
            message.channel.send('Setup has been cancelled!').then(c => c.delete({timeout: 5000}));
        })
    }
}