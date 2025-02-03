const express = require("express");
const { validateTicket, Ticket } = require("../models/ticket");
const { Event } = require("../models/event");
const router = express.Router();

router.post("/tickets", async (req, res) => {
  try {
    const { error, value: order } = validateTicket(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const event = await Event.findById(order.eventId);
    if (!event) return res.status(404).send("Invalid Event.");

    if (event.capacity === event.ticketsSold)
      return res.status(400).send("Tickets sold out.");

    const remainingTickets = event.capacity - event.ticketsSold;

    if (order.nTickets > remainingTickets)
      return res
        .status(400)
        .send(
          `Sorry, your order cannot be processed, we only have ${remainingTickets} remaining.`
        );

    let newOrder = new Ticket(order);
    // we need to implement logging using library such as winston
    // We need to implement robust error handling, to account for database related validations and to avoid repitions
    // we need to implement transaction to make sure (saving new order and event)they both complete or they both roll back
    await newOrder.save();

    event.ticketsSold += order.nTickets;
    await event.save();

    res.status(201).send(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
