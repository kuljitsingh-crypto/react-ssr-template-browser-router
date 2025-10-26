const { CsrfToken } = require("../util/csrfTokenHelper");

const generateCsrfToken = async (req, res) => {
  const token = await CsrfToken.generate(req);
  return res.status(200).json({ csrfToken: token });
};

exports.CsrfTokenController = {
  generate: generateCsrfToken,
};
