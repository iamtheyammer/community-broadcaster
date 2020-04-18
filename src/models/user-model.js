const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    googleId: String,
    authenticationFrom: String,
    googleProfilePicture: String,
    auth: Number,
    associatedIPs: Array,
    schoolAssociation: String,
    grade: Number,
    dateCreated: Date,
    banned: Boolean,
    chatTag: String
})

const User = mongoose.model('user', userSchema)

module.exports = User;