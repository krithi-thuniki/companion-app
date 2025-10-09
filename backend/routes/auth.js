const router = require("express").Router();
const ctrl = require("../controllers/authController");

// Register, Login, Logout
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.post("/logout", ctrl.logout);

module.exports = router;
