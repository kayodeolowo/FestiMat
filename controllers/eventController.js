const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Event = require("../models/eventModels")
const Like = require("../models/likeModel");
const Booking = require("../models/bookingModel"); // Your new booking schema
const  { paginate, search , filterByEventType} = require("../utils/utils")


// Get all events with pagination, search, and filter by event type
const getEvents = asyncHandler(async (req, res) => {
  // Extract query parameters
  let { page = 1, pageSize = 10, search: searchTerm = '', eventType } = req.query;

  // Fetch all events
  const allEvents = await Event.find().select('-description').sort({ createdAt: -1 });

  // Determine the event_type based on the current date
  const now = new Date();
  allEvents.forEach(event => {
    const eventDate = new Date(event.date);
    event.event_type = eventDate < now ? 'past' : 'upcoming';
  });

  // Apply search using the search utility
  const filteredEvents = search(allEvents, searchTerm, ['name', 'location']);

  // Apply event type filter using the filterByEventType utility
  const eventsByType = filterByEventType(filteredEvents, eventType);

  // Apply pagination using the paginate utility
  const paginatedEvents = paginate(eventsByType, page, pageSize);

  // Return the paginated, filtered, and searched events
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    data: {
      data: paginatedEvents.data,
      totalItems: paginatedEvents.totalItems,
      totalPages: paginatedEvents.totalPages,
      currentPage: paginatedEvents.currentPage
    }
  });
});


// Create a event
const createEvent = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, date, time, description , location,  total_seats, event_type, ticket_type, price} = req.body;

  // Array to collect missing fields
  let missingFields = [];

  if (!name) missingFields.push("name");
  if (!date) missingFields.push("date");
  if (!time) missingFields.push("time");
  if (!location) missingFields.push("location");
  if (!description) missingFields.push("description");
  if (!event_type) missingFields.push("event_type");
  if (!total_seats) missingFields.push("total_seats");
  if (!ticket_type) missingFields.push("ticket_type");
  if (!price) missingFields.push("price");


  if (missingFields.length > 0) {
      res.status(400);
      throw new Error(` ${missingFields.join(", ")} is required`);
  }

  const event = await Event.create({
      name,
      location,
      date,
      time,
      event_type,
      description,
      total_seats,
      ticket_type,
      price
  });
  const data = event;
  res.status(201).json({
      status: "success",
      message: "event created successfully",
      data
  });
});

// Get single event 
const getEvent = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("event not found");
    }
    
    const event= await Event.findById(req.params.id);
    const data = event;
    if (!event) {
        res.status(404);
        throw new Error("event not found");
    }
    res.status(200).json({
        status: "success",
        message: "Data fetched successfully",
        data
    });
});

// Update event
const updateEvent = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("event not found");
    }
  
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404);
      throw new Error("event not found");
    }
  
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  const data = updatedEvent;
    res.status(200).json({
      status: "success",
      message: "Event edited successfully",
      data
    });
  });

// Delete event
const deleteEVent = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error("event not found");
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
        res.status(404);
        throw new Error("event not found");
    }

    await event.deleteOne({ _id: req.params.id });
    res.status(200).json({ status: "success", message: "Event Deleted Succesfully" });
});

//create like with specific user id
const createLike = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id; // Fetch the userId from req.user

  // Check if eventId is provided
  if (!eventId) {
    return res.status(400).json({
      status: "error",
      message: "eventId is required"
    });
  }

  // Validate eventId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      status: "error", 
      message: "Invalid event ID"
    });
  }

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid user ID"
    });
  }

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({
      status: "error",
      message: "Event not found"
    });
  }

  try {
    // Check if the like already exists for this user and event
    const existingLike = await Like.findOne({ eventId, userId });

    if (existingLike) {
      // If the like exists, remove it
      await Like.deleteOne({ _id: existingLike._id });
      return res.status(200).json({
        status: "success",
        message: "Like removed successfully",
        liked: false
      });
    } else {
      // If the like does not exist, create it
      const like = await Like.create({ eventId, userId });
      return res.status(201).json({
        status: "success",
        message: "Like added successfully",
        liked: true,
        data: like
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error processing like/unlike",
      error: error.message
    });
  }
});



  
//get likes with user id
const getLikes = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Fetch userId from req.user

  // Fetch likes for the specific user and populate event details
  const likes = await Like.find({ userId })
    .populate({
      path: 'eventId', // Reference to the Event model
     
    })
    .sort({ createdAt: -1 }); // Sort by createdAt in descending order

  // Get the total number of likes
  const totalLikes = likes.length;

  // Return the data directly
  res.status(200).json({
    status: "success",
    message: "Data fetched successfully",
    data: {
      totalLikes,
      likes, // Return the likes array directly without formatting
    },
  });
});

  



const bookEvent = asyncHandler(async (req, res) => {
  const { eventId, fullName, seats_qty } = req.body; // Extract required data
  const userId = req.user.id; // User ID from authenticated request

  // Validate required fields
  if (!eventId || !fullName || !seats_qty) {
    return res.status(400).json({
      status: "error",
      message: "eventId, fullname, and seats_qty are required fields",
    });
  }

  // Validate eventId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid event ID",
    });
  }

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({
      status: "error",
      message: "Event not found",
    });
  }

  // Check if requested seats exceed the available seats
  if (event.total_seats < seats_qty) {
    return res.status(400).json({
      status: "error",
      message: `Not enough seats available. Only ${event.total_seats} seats left.`,
    });
  }

  // Create booking
  try {
    const booking = await Booking.create({
      eventId,
      userId,
      fullName,
      seats_qty,
    });

    // Deduct the seats from the event's total_seats
    event.total_seats -= seats_qty;
    await event.save();

    res.status(201).json({
      status: "success",
      message: "Event booked successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to process the booking",
      error: error.message,
    });
  }
});



  


module.exports = {createEvent, getLikes, bookEvent, createLike, getEvents, getEvent, updateEvent, deleteEVent, createEvent };
