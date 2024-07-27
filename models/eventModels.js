const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({

    // user_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: "User"
    // },  to add a specific user id when creating the event  
    name: {
        type: String,
        required: [true, "please add the event name"]
    },

    date: {
        type: String,
        required: [true, "please add the date of event"]
    },

    time: {
        type: String,
        required: [true, "please add the time of event"]
    },

    location: {
        type: String,
        required: [true, "please add the location of event"]
    },


    description: {
        type: String,
        required: [true, "please add the description"]
    },

   
},

{
    timestamps: true
}

);



module.exports = mongoose.model("event", eventSchema)