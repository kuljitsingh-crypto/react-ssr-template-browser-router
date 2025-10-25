const DtoValidator = require("joi");

const validDate = (dtoFields, data) => {
  return new Promise((resolve, reject) => {
    const { error, value } = dtoFields.schema.validate(data);
    if (error) {
      reject(error);
    } else {
      resolve(value);
    }
  });
};

const insertValidValue = (obj, fieldName) => (val) => {
  obj[fieldName] = val;
};

const parseQuery = (query) => {
  const parse = (v) => {
    try {
      return JSON.parse(v);
    } catch (_) {
      const array = v.split(",");
      if (array.length === 1) {
        return array[0];
      }
      return array.map(parse);
    }
  };
  return Object.entries(query).reduce((acc, [key, val]) => {
    acc[key] = parse(val);
    return acc;
  }, {});
};

const prepareValidationError = (err) => {
  if (err && err.details && Array.isArray(err.details)) {
    return err.details.reduce((acc, details) => {
      const { context, message } = details;
      const key = context.key;
      if (acc[key] === undefined) {
        acc[key] = [];
      }
      acc[key].push(message);
      return acc;
    }, {});
  }
  return { general: err.message };
};

class DtoFields {
  schema = null;
  /**
   * @param {object} fields
   */
  fields(fields) {
    this.schema = DtoValidator.object(fields);
  }
}

class DTO {
  #bodyFields = null;
  #queryFields = null;
  #paramsFields = null;
  constructor(dtoName) {
    if (!dtoName) {
      throw new Error(
        "DTO name is required. It is used to access in request object."
      );
    }
    this.dtoName = dtoName;
    this.validate = this.validate.bind(this);
  }

  /**
   * @return {DtoFields}
   */
  get body() {
    this.#bodyFields = new DtoFields();
    return this.#bodyFields;
  }

  /**
   * @return {DtoFields}
   */
  get query() {
    this.#queryFields = new DtoFields();
    return this.#queryFields;
  }
  /**
   * @return {DtoFields}
   */
  get param() {
    this.#paramsFields = new DtoFields();
    return this.#paramsFields;
  }

  async validate(req, res, next) {
    const dtoData = {};

    try {
      const query = parseQuery(req.query);
      const promises = [];
      if (this.#bodyFields?.schema) {
        promises.push(
          validDate(this.#bodyFields, req.body).then(
            insertValidValue(dtoData, "body")
          )
        );
      }
      if (this.#queryFields?.schema) {
        promises.push(
          validDate(this.#queryFields, query).then(
            insertValidValue(dtoData, "query")
          )
        );
      }
      if (this.#paramsFields?.schema) {
        promises.push(
          validDate(this.#paramsFields, req.params).then(
            insertValidValue(dtoData, "params")
          )
        );
      }
      await Promise.all(promises);
      req[this.dtoName] = { ...dtoData };
      next();
    } catch (err) {
      const errors = prepareValidationError(err);
      if (res) {
        res.status(401).json({ errors: errors });
      }
    }
  }
}

module.exports.DTO = DTO;
module.exports.DtoValidator = DtoValidator;
