const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'event',  // Refers to the Event model
    required: true
  },
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
    required: [true, "Please add number of seats to book"]
  },

  ticketID: {
    type: String,
    required: true,  // Ensure ticketID is required
    unique: true     // Enforce uniqueness of ticketID
  },

  seatNumbers: {
    type: [Number], // Array of seat numbers that were booked
    required: true,  // Ensure that seatNumbers are always provided
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("booking", bookingSchema);
