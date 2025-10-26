const apiRouter = require("express").Router();
const { CsrfTokenController } = require("../controller");
const { testDto } = require("../dto");

apiRouter.post("/test-post", testDto.validate, (req, res) => {
  console.log(req.testDto);
  res.sendStatus(200);
});

apiRouter.get("/csrf-token", CsrfTokenController.generate);

exports.apiRouter = apiRouter;
