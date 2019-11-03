const express = require("express");
const router = express.Router();

const blockUnauthorized = require("./../../middlewares/blockUnauthorized");

const userController = require("../controllers/users.js");

// All Users
router.get("/", blockUnauthorized, userController.get_all_users);

// Signup new User
router.post("/signup", userController.signup_user);

// Login User
router.post("/login", userController.login_user);

// TODO: Patch One user
router.patch("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  res.status(200).json({
    message: "PATCH 1 user : " + userId
  });
});

// TODO: Delete One user
router.delete("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  res.status(200).json({
    message: "DELETE 1 user : " + userId
  });
});

module.exports = router;
