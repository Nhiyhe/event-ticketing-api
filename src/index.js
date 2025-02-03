const http = require("http");
const app = require("./app");
const connection = require("./database/connection.js");

const port = 8080;

connection()
  .then(() => {
    http.createServer(app).listen(port, () => {
      console.log(`Server started on ${port}`);
    });
  })
  .catch((err) => console.log(`Error connection to the database`));
