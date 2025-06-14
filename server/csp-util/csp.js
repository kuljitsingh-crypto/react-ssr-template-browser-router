const { default: helmet } = require("helmet");

const self = "'self'";
const none = "'none'";
const data = "data:";
const unsafeInline = "'unsafe-inline'";
const unsafeEval = "'unsafe-eval'";

const directives = {
  //sets the allowed base URL for relative URLs
  baseUri: [self],
  // sets the default source for all types of resources
  defaultSrc: [self],
  // sets the allowed sources for JavaScript code
  scriptSrc: [self, unsafeInline, unsafeEval],
  // sets the allowed sources for CSS styles
  styleSrc: [self, unsafeInline],
  // sets the allowed sources for images
  imgSrc: [self, data],
  // sets the allowed sources for network connections
  connectSrc: [self, "https://fakestoreapi.com"],
  // sets the allowed sources for fonts
  fontSrc: [self],
  // sets the allowed sources for objects (such as Flash and Java applets)
  objectSrc: [none],
  // sets the allowed sources for media (such as audio and video)
  mediaSrc: [self],
  // sets the allowed sources for iframe
  frameSrc: [self],
};

/**
 *
 * @param {string} reportUri URL where the browser will POST the
 * policy violation reports
 * @param {boolean} reportOnly In the report mode, requests are only
 * reported to the report URL instead of blocked
 * @param {Boolean} enforceSsl When SSL is enforced, all mixed content
 * is blocked/reported by the policy
 */
module.exports = (reportUri, reportOnly, enforceSsl) => {
  const directivesWithExtraData = Object.assign(
    {
      reportUri: [reportUri],
    },
    directives
  );
  // Helmet v4 expects every value to be iterable so strings or booleans are not supported directly
  // If we want to add block-all-mixed-content directive we need to add empty array to directives
  // See Helmet's default directives:
  // https://github.com/helmetjs/helmet/blob/bdb09348c17c78698b0c94f0f6cc6b3968cd43f9/middlewares/content-security-policy/index.ts#L51
  if (enforceSsl) {
    directivesWithExtraData.blockAllMixedContent = [];
  }
  const contentSecurityPolicy = {
    useDefaults: false,
    directives: directivesWithExtraData,
    reportOnly: !!reportOnly,
  };

  return helmet({
    contentSecurityPolicy: contentSecurityPolicy,
  });
};
