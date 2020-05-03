const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,
    guildName: String,
    sharedRoleID: String,
    ownableRoleID: String,
    ownedRoleID: String,
    petOwnersRoleID: String
});

module.exports = mongoose.model('Guild', guildSchema, 'guilds');