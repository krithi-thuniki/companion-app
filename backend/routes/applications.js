const router = require("express").Router();
const ctrl = require("../controllers/applicationsController");
const auth = require("../middleware/authMiddleware"); // your jwt auth middleware

router.get("/", auth, ctrl.listApplications);
router.post("/", auth, ctrl.createApplication);
router.patch("/:id", auth, ctrl.updateStatus);

module.exports = router;
