const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',  // Refers to the Event model
    required: true
  },
  // You can add additional fields if needed, such as userId to track which user liked the event
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  fullName: {
    type: String,
    required: [true, "Full Name is required"]
  },


  seats_qty: {
    type: Number,
    required: [true, "please add number of seats to book"]
  },


  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("eventModel", bookingSchema)
