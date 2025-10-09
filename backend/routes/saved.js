const router = require("express").Router();
const ctrl = require("../controllers/savedController");

router.get("/", ctrl.listSaved);
router.post("/", ctrl.saveItem);
router.delete("/:id", ctrl.removeSaved);

module.exports = router;
