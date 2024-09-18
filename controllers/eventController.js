const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Event = require("../models/eventModels")
const Like = require("../models/likeModel");
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
    data: paginatedEvents
  });
});


// Create a event
const createEvent = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, date, time, description , location, event_type} = req.body;

  // Array to collect missing fields
  let missingFields = [];

  if (!name) missingFields.push("name");
  if (!date) missingFields.push("date");
  if (!time) missingFields.push("time");
  if (!location) missingFields.push("location");
  if (!description) missingFields.push("description");
  if (!event_type) missingFields.push("event_type");


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
      res.status(400);
      throw new Error("eventId is required");
  }

  // Validate eventId format
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400);
      throw new Error("Invalid event ID");
  }

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400);
      throw new Error("Invalid user ID");
  }

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
      res.status(404);
      throw new Error("Event not found");
  }

  // Check if the like already exists for this user and event
  const existingLike = await Like.findOne({ eventId, userId });

  if (existingLike) {
      // If the like exists, remove it
      await Like.deleteOne({ _id: existingLike._id });
      res.status(200).json({
          status: "success",
          message: "Like removed successfully"
      });
  } else {
      // If the like does not exist, create it
      const like = await Like.create({ eventId, userId });
      res.status(201).json({
          status: "success",
          message: "Like added successfully",
          data: like
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
        select: 'location date time name' // Fields to include from the Event model
      })
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  
    // Format the data to match the desired output
    const formattedLikes = likes.map(like => ({    
            _id: like._id,
            event_id: like.eventId._id,
            name: like.eventId.name,
            date: like.eventId.date,
            location: like.eventId.location,
            time: like.eventId.time,
            
          
            
            
          
    }));
  
    // Get the total number of likes
    const totalLikes = formattedLikes.length;
  
    // Return the data
    res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: {
        totalLikes,
        likes: formattedLikes
      }
    });
  });
  
  
  


module.exports = {createEvent, getLikes, createLike, getEvents, getEvent, updateEvent, deleteEVent, createEvent };
