const Joi = require("joi");
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    nTickets: { type: Number, min: 0, required: true },
    date: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

function validateTicket(transaction) {
  const schema = Joi.object({
    eventId: Joi.string().required(),
    nTickets: Joi.number().min(1).required(),
  });

  return schema.validate(transaction);
}

module.exports = { Ticket, validateTicket };
