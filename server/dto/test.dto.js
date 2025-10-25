const { DTO, DtoValidator } = require("../util/dtoHelper");

const testDto = new DTO("testDto");
testDto.body.fields({
  name: DtoValidator.string().min(5).required(),
  age: DtoValidator.number().required(),
});

module.exports.testDto = testDto;
