const mongoose = require("mongoose")

const eventSchema = mongoose.Schema({

     
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

    event_type: {
        type: String, // Optional, if you want to store the event type directly in the document
        enum: ['past', 'upcoming'],
        default: 'upcoming'
    }

},

{
    timestamps: true
}

);



module.exports = mongoose.model("event", eventSchema)