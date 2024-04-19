const bcrypt = require("bcrypt");
const userModel = require("../models/userModel.js");

module.exports = {
  registerUser: async (req, res) => {
    const { username, password, email, height, weight, age, activity, goal_weight, goal_time} = req.body;

    const user = {
      username,
      password,
      email: email.toLowerCase(),
      height,
      weight,
      age,
      activity,
      goal_weight,
      goal_time,
    };

    try {
      const userid = await userModel.createUser(user);
      res.status(201).json({ message: "User registered successfully", userid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await userModel.getUserByEmail(email.toLowerCase());

      if (!user) return res.status(404).json({ error: "User not found" });

      const passwordMatch = await bcrypt.compare(password + "", user.password);

      if (!passwordMatch)
        return res.status(401).json({ error: "Authentication failed" });

      res.json({ message: "Login successful", userid: user.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserById: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await userModel.getUserById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getDetailsById: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await userModel.getDetailsById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateUserById: async (req, res) => {
    const userId = parseInt(req.params.id);
    // const {username, password, email, first_name, last_name} = req.body;

    let updatedUser = JSON.parse(JSON.stringify(req.body));

    try {
      await userModel.updateUserById(userId, updatedUser);
      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateDetailsById: async (req, res) => {
    const userId = parseInt(req.params.id);

    let updatedDetails = JSON.parse(JSON.stringify(req.body));

    try {
      await userModel.updateDetailsById(userId, updatedDetails);
      res.json({ message: "Details updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateGoalById: async (req, res) => {
    const userId = parseInt(req.params.id);

    let updatedDetails = JSON.parse(JSON.stringify(req.body));

    try {
      await userModel.updateGoalById(userId, updatedDetails);
      res.json({ message: "Details updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
