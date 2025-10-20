const router = require("express").Router();

// ADD Your Custom Routes
router.get("*", (req, res) => res.sendStatus(200));

exports.wellKnownRouter = router;
