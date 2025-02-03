const Joi = require("joi");
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    date: { type: Date, tim: true, unique: true, required: true },
    capacity: { type: Number, trim: true, required: true },
    costPerTicket: { type: Number, min: 0, max: 255, required: true },
    ticketsSold: { type: Number, min: 0, default: 0 },
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

const Event = mongoose.model("Event", eventSchema);

function validateEvent(event) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    date: Joi.date().required(),
    capacity: Joi.number().min(0).required(),
    costPerTicket: Joi.number().min(0).required(),
  });

  return schema.validate(event);
}

module.exports = { Event, validateEvent };
