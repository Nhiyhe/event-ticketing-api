# Event Ticketing System

## Overview

This is a RESTful API for an event ticketing system built using **Node.js, Express, and MongoDB (Mongoose)**. The API allows users to:

- Create new events
- Record ticket transactions
- Retrieve statistics around ticket sales

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for building RESTful APIs
- **MongoDB** - NoSQL database for event and transaction storage
- **Mongoose** - ODM (Object Data Modeling) for MongoDB
- **Jest & Supertest** - Testing framework and HTTP assertions

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/event-ticketing-api.git
   cd event-ticketing-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the server:

   ```sh
   npm watch
   ```

4. Run tests:
   ```sh
   npm test
   ```

## API Endpoints

### 1. Create a New Event

**POST** `/events`

#### Request Body:

```json
{
  "name": "Charity Auction",
  "date": "2024-10-31",
  "capacity": 100,
  "costPerTicket": 5
}
```

#### Response:

```json
{
  "id": "65a7b7c8e4f3a92b1a2d1234",
  "name": "Charity Auction",
  "date": "2024-10-31T00:00:00.000Z",
  "capacity": 100,
  "costPerTicket": 5,
  "ticketSold": 0
}
```

### 2. Record a Ticket Transaction

**POST** `/tickets`

#### Request Body:

```json
{
  "eventId": "65a7b7c8e4f3a92b1a2d1234",
  "nTickets": 3
}
```

#### Possible Responses:

- **200 OK** (Successful purchase)
- **400 Bad Request** (Invalid event, sold out, exceeding capacity)
- **404 Not Found** (Event does not exist)

### 3. Retrieve Ticket Sales Statistics

**GET** `/statistics`

#### Response Example:

```json
[
  {
    "year": 2024,
    "month": 9,
    "revenue": 10203,
    "nEvents": 10,
    "averageTicketsSold": 40
  },
  {
    "year": 2024,
    "month": 8,
    "revenue": 0,
    "nEvents": 0,
    "averageTicketsSold": 0
  }
]
```

## Future Enhancements

If more time were available, the following improvements could be implemented:

- **Logging System** - Implement Logging system for error and success loggin.
- **Pagination for Statistics** - To handle large datasets efficiently.
- **Transaction** - implement transaction in /tickets route. to make sure (saving new order and event)they both complete or they both roll back in case of error.
- **Robust Error handling** - Implementation of robust error handling, to account for database related validations and to avoid repetitions.

## License

This project is licensed under the MIT License.
