const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", userController.getAllUsers);
router.get("/details/:id", userController.getDetailsById);
router.get("/users/:id", userController.getUserById);
router.put("/details/:id", userController.updateDetailsById);
router.put("/goal/:id", userController.updateGoalById);
router.put("/users/:id", userController.updateUserById);

module.exports = router;