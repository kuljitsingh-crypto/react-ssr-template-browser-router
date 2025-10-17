const router = require("express").Router();

router.get("/appspecific/com.chrome.devtools.json", (req, res) =>
  res.sendStatus(200)
);

exports.wellKnownRouter = router;
