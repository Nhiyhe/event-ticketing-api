const express = require("express");
const { Ticket } = require("../models/ticket");
const route = express.Router();

route.get("/statistics", async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    oneYearAgo.setDate(1);

    const transactions = await Ticket.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "eventDetails",
        },
      },
      { $unwind: "$eventDetails" },
      {
        $match: {
          "eventDetails.date": { $gte: oneYearAgo },
        },
      },
      {
        $project: {
          year: { $year: "$eventDetails.date" },
          month: { $month: "$eventDetails.date" },
          revenue: { $multiply: ["$nTickets", "$eventDetails.costPerTicket"] },
          eventId: "$eventDetails._id",
          ticketsSold: "$nTickets",
          capacity: "$eventDetails.capacity",
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          revenue: { $sum: "$revenue" },
          nEvents: { $sum: 1 },
          totalTicketsSold: { $sum: "$ticketsSold" },
          totalCapacity: { $sum: "$capacity" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          revenue: 1,
          nEvents: 1,
          averageTicketsSold: {
            $cond: [
              { $eq: ["$totalCapacity", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$totalTicketsSold", "$totalCapacity"] },
                  100,
                ],
              },
            ],
          },
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = route;
