const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    memberID: String,
    memberName: String,
    pet1: String,
    pet2: String,
    pet3: String
});

module.exports = mongoose.model('User', userSchema, 'users');