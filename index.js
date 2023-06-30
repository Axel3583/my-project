const express = require("express");
const cors = require("cors");
const square = require("./lib/square");
const connection = require("./config");

const userRoute = require("./api/routes/userRoute");

const app = express();
const port = 8080;

// Configure express middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable("x-powered-by");

// Register the routes
app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/square/:nb", (req, res) => {
  const nb = req.params.nb;
  res.send(square(parseInt(nb)).toString());
});

userRoute(app); // pass the express app instance to userRoute

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    status: 500,
    message: err.message,
    body: {},
  });
});

let server;

// Start the server
connection
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
    server = app.listen(port, () => { 
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = {
  app,
  closeServer: () => {
    if (server) {
      server.close();
    }
    connection.close();
  },
};

