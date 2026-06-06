const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

},{timestamps: true});


const User =mongoose.model('User', userSchema);
module.exports = User;
