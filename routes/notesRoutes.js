const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

router
  .route("/")
  .get(Controller.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
