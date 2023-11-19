const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const serverConfig = require("./config/serverConfig");
const dbConfig = require("./config/db.config");
const User = require("./models/Users");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(dbConfig.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", (err) => {
  console.error("Database connection error:", err);
});

db.once("open", () => {
  console.log("MongoDB connected successfully");
});

app.post("/api/users", async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = new User({ username, email });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Could not create the user" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve users" });
  }
});

app.delete("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Could not delete the user" });
  }
});

app.put("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Could not update the user" });
  }
});

app.listen(serverConfig.PORT, "localhost", () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
});
