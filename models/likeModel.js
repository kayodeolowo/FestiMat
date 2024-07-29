const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("like", likeSchema)
