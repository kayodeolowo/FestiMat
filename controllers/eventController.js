const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Event = require("../models/eventModels")


// Get all events with pagination
const getEvents = asyncHandler(async (req, res) => {
  
  // Get the page number and page size from query parameters
  let { page = 1, pageSize = 10 } = req.query;
  page = parseInt(page);
  pageSize = parseInt(pageSize);

  // Calculate the number of documents to skip
  const skip = (page - 1) * pageSize;

  // Get total number of eventss
  const totalEvents = await Event.countDocuments();

  // Fetch events for the current page
  const events = await Event.find()
  .select('-description') // this part excludes an option i don't need to appear
  .sort({ createdAt: -1 }) // Sort by createdAt in descending order
  .skip(skip)
      .limit(pageSize);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalEvents / pageSize);

  // Return the data with pagination info
  res.status(200).json({
      status: "success",
      message: "Data fetched successfully",
      data: {
          totalEvents,
          totalPages,
          currentPage: page,
          // pageSize,
          events
      }
  });
});

// Create a event
const createEvent = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, date, time, description , location} = req.body;

  // Array to collect missing fields
  let missingFields = [];

  if (!name) missingFields.push("name");
  if (!date) missingFields.push("date");
  if (!time) missingFields.push("time");
  if (!location) missingFields.push("location");
  if (!description) missingFields.push("description");

  if (missingFields.length > 0) {
      res.status(400);
      throw new Error(` ${missingFields.join(", ")} is required`);
  }

  const event = await Event.create({
      name,
      email,
      phoneNumber,
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
    res.status(200).json({ status: "success", message: "event Deleted" });
});

module.exports = { getEvents, getEvent, updateEvent, deleteEVent, createEvent };
