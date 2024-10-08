const express = require("express");
const router = express.Router()
const validateToken = require("../middleware/validateTokenHandler");
const { getEvents, getEvent, createEvent, updateEvent, deleteEVent,  createLike, getLikes  } = require("../controllers/eventController");

// validation for routes 
router.use(validateToken);  
router.route("/getAllEvents").get(getEvents);
router.route("/getLikes").get(getLikes);
router.route("/:id").get(getEvent)
router.route("/createEvent").post(createEvent);
router.route("/createLike").post(createLike);
router.route("/updateEvent/:id").put(updateEvent);
router.route("/deleteEvent/:id").delete(deleteEVent);


module.exports = router; 