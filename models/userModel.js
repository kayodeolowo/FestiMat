const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [ true, "please add the username"]
    },

    email: {
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