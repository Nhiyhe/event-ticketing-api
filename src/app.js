const express = require("express");
const eventsRouter = require("./routes/events");
const ordersRouter = require("./routes/tickets");
const statisticsRoute = require("./routes/statistics");

const app = express();
app.use(express.json());

app.use(eventsRouter);
app.use(ordersRouter);
app.use(statisticsRoute);

app.all("*", (req, res) => {
  res.status(400).send("invalid route");
});

module.exports = app;
