const apiRouter = require("express").Router();
const { testDto } = require("../dto");

apiRouter.post("/test-post", testDto.validate, (req, res) => {
  console.log(req.testDto);
  res.sendStatus(200);
});

exports.apiRouter = apiRouter;
