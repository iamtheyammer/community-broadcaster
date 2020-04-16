const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    googleId: String,
    authenticationFrom: String,
    auth: Number,
    dateCreated: Date
})

const User = mongoose.model('user', userSchema)

module.exports = User;