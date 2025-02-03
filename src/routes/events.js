const express = require("express");
const { validateEvent, Event } = require("../models/event");
const router = express.Router();

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find().sort("date");
    res.send(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/events", async (req, res) => {
  try {
    const { error, value: newEvent } = validateEvent(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let event = new Event(newEvent);
    event = await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
