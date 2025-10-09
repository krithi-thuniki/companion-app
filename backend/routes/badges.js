const router = require("express").Router();
const ctrl = require("../controllers/badgeController");

router.get("/", ctrl.getBadges);

module.exports = router;
