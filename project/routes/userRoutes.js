const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users", userController.getAllUsers);
router.get("/users/details/:id", userController.getDetailsById);
router.get("/users/:id", userController.getUserById);
router.put("/users/details/:id", userController.updateDetailsById);
router.put("/users/goal/:id", userController.updateGoalById);
router.put("/users/:id", userController.updateUserById);
router.get("/recipes", userController.getAllRecipes);
router.get("/ingredients", userController.getAllIngredients);
router.get("/users/calculate/:id", userController.calculateForUserById);
router.get("/users/ration/:id", userController.getDailyRationById);

module.exports = router;