const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [ true, "please add the username"]
    },

    first_name: {
        type: String,
        required: [ true, "please add the first name"]
    },

    last_name: {
        type: String,
        required: [ true, "please add the last name"]
    },

    email: {
        type: String,
        required: [ true, "please add the email"],
        unique: [true, "Email Address already registered"]
    },

    phoneNumber: {
        type: String,
        required: [ true, "please add the email"],
        unique: [true, "Email Address already registered"]
    },

    password:{
        type: String,
        required: [ true, "please add the password"],
    },
    
},

{
    timestamps: true
})


module.exports = mongoose.model("user", userSchema);