const mongoose = require('mongoose');

const petPlaySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ownerID: String,
    guildID: String,
    pet1: String,
    pet2: String,
    pet3: String
});

module.exports = mongoose.model('petPlay', petPlaySchema, 'petPlay');