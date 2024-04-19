const express = require("express");
const userRoutes = require("./routes/userRoutes.js");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

app.use("/", express.static(__dirname + "/public"));

// Use user routes
app.use("/api", userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
