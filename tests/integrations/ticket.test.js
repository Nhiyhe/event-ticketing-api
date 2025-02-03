const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const { Event } = require("../../src/models/event");

describe("POST /tickets", () => {
  let mongoServer;
  let event;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    event = new Event({
      name: "Test Event",
      date: new Date(),
      capacity: 100,
      ticketsSold: 0,
      costPerTicket: 10,
    });

    await event.save();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it("should successfully create a ticket transaction", async () => {
    const res = await request(app).post("/tickets").send({
      eventId: event._id.toString(),
      nTickets: 5,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nTickets).toBe(5);
  });

  it("should return 404 for an invalid event", async () => {
    const fakeEventId = new mongoose.Types.ObjectId();
    const res = await request(app).post("/tickets").send({
      eventId: fakeEventId.toString(),
      nTickets: 2,
    });

    expect(res.status).toBe(404);
    expect(res.text).toBe("Invalid Event.");
  });

  it("should return 400 if event is sold out", async () => {
    event.ticketsSold = 100;
    await event.save();

    const res = await request(app).post("/tickets").send({
      eventId: event._id.toString(),
      nTickets: 1,
    });

    expect(res.status).toBe(400);
    expect(res.text).toBe("Tickets sold out.");
  });

  it("should return 400 if transaction exceeds capacity", async () => {
    event.ticketsSold = 98;
    await event.save();

    const res = await request(app).post("/tickets").send({
      eventId: event._id.toString(),
      nTickets: 5,
    });

    expect(res.status).toBe(400);
    expect(res.text).toBe(
      "Sorry, your order cannot be processed, we only have 2 remaining."
    );
  });

  it("should return 400 for missing or invalid input data", async () => {
    const res = await request(app).post("/tickets").send({
      nTickets: 2,
    });

    expect(res.status).toBe(400);
  });

  it("should return 500 for server errors", async () => {
    jest.spyOn(Event, "findById").mockImplementationOnce(() => {
      throw new Error("Server error");
    });

    const res = await request(app).post("/tickets").send({
      eventId: event._id.toString(),
      nTickets: 2,
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error", "Server error");
  });
});
