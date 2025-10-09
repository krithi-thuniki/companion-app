const router = require("express").Router();
const ctrl = require("../controllers/opportunityController");

// GET /api/opportunities?type=internship|job&q=react&location=india&mode=remote&limit=50
router.get("/", ctrl.search);

// GET /api/opportunities/:id (re-queries and finds by id; or pass ?q= to help)
router.get("/:id", ctrl.details);

module.exports = router;
