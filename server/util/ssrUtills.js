const path = require("path");
const { ChunkExtractor } = require("@loadable/server");
const fetch = require("node-fetch");
const fs = require("fs");
const lodash = require("lodash");
const url = require("node:url");
const { isCurrentUserAuthenticated } = require("./helperFunctions");

const parseQueryValue = (value) => {
  if (value === undefined) return null;
  value = decodeURIComponent(value);
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

function parseQueryString(queryString) {
  const queries = (queryString || "").replace("?", "").split("&");
  const paramObject = queries.reduce((acc, str) => {
    const [key, value] = str.split("=");
    if (key) {
      acc[key] = parseQueryValue(value);
    }
    return acc;
  }, {});

  return paramObject;
}

class CustomChunkExtractor extends ChunkExtractor {
  addChunk(chunk) {
    chunk = chunk.replace("pages-", "");
    const chunkArr = chunk.split("-");
    if (chunkArr.length >= 2) {
      chunk = chunkArr[0];
    }
    super.addChunk(chunk);
  }
}

const buildPath = path.join(__dirname, "..", "..", "build");

const redirectCode = new Set([301, 302, 303, 307, 308]);
const notFoundCode = new Set([404]);

// The HTML build file is generated from the `public/index.html` file
// and used as a template for server side rendering. The application
// head and body are injected to the template from the results of
// calling the `renderApp` function imported from the bundle above.
const indexHtml = fs.readFileSync(path.join(buildPath, "index.html"), "utf-8");

// This pattern matches the end of a line ($) immediately followed by the start of a line (^).
//Since no content can be both the end and the start of a line simultaneously,
//this effectively matches nothing.
const reNoMatch = /($^)/;

// Not all the Helmet provided data is tags to be added inside <head> or <body>
// <html> tag's attributes need separate interpolation functionality
const templatedWithHtmlAttributes = lodash.template(indexHtml, {
  // Replace htmlAttributes (Helmet data) in the HTML template with the following
  // syntax: data-htmlattr="variableName"
  //
  // This syntax is very intentional: it works as a data attribute and
  // doesn't render attributes that have special meaning in HTML renderig
  // (except containing some data).
  //
  // This special attribute should be added to <html> tag
  // It may contain attributes like lang, itemscope, and itemtype
  interpolate: /data-htmlattr=\"([\s|S]+?)\"/g,
  // Disable evaluated and escaped variables in the template
  escape: reNoMatch,
  evaluate: reNoMatch,
});

// Template tags inside given template string (templatedWithHtmlAttributes),
// which contains <html> attributes already.
const templateTags = (indexHtmlWithHtmlAttributes) =>
  lodash.template(indexHtmlWithHtmlAttributes, {
    // Interpolate variables in the HTML template with the following
    // syntax: <!--!variableName-->
    //
    // This syntax is very intentional: it works as a HTML comment and
    // doesn't render anything visual in the dev mode, and in the
    // production mode, HtmlWebpackPlugin strips out comments using
    // HTMLMinifier except those that aren't explicitly marked as custom
    // comments. By default, custom comments are those that begin with a
    // ! character.
    //
    // Note that the variables are _not_ escaped since we only inject
    // HTML content.
    //
    // See:
    // - https://github.com/ampedandwired/html-webpack-plugin
    // - https://github.com/kangax/html-minifier
    // - Plugin options in the production Webpack configuration file
    interpolate: /<!--!([\s|\S]+?)-->/g,
    // Disable evaluated and escaped variables in the template
    // As we donot want to evaluate any javascript code during templating.
    evaluate: reNoMatch,
    escape: reNoMatch,
  });

// Interpolate htmlAttributes and other helmet data into the template
const template = (templateData) => {
  const htmlAttributes = templateData.htmlAttributes;
  const templateDataWithoutHtmlAttributes = lodash.omit(templateData, [
    "htmlAttributes",
  ]);
  const templateWithHtmlAttributes = templatedWithHtmlAttributes({
    htmlAttributes,
  });
  return templateTags(templateWithHtmlAttributes)(
    templateDataWithoutHtmlAttributes
  );
};

function createFetchRequestForServer(req) {
  const origin = `${req.protocol}://${req.get("host")}`;
  const url = new URL(req.originalUrl || req.url, origin);

  const abortController = new AbortController();

  req.on("close", () => abortController.abort());

  const requestObject = {
    method: req.method,
    signal: abortController.signal,
    headers: req.headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    requestObject.body = req.body;
  }

  return new fetch.Request(url.href, requestObject);
}

function checkAndReturnRouterContext(serverContext = {}) {
  return function (context) {
    if (context instanceof Response || !context.matches) {
      if (redirectCode.has(context.status)) {
        serverContext.url = context.headers.get("Location");
      } else if (notFoundCode.has(context.status)) {
        serverContext.nofound = true;
        return context;
      } else {
        throw new Error(`Server response ${context.status} is not a redirect.`);
      }
      return null;
    }
    if (
      context &&
      Array.isArray(context.matches) &&
      context.matches.length > 0
    ) {
      const [firstMatch] = context.matches;
      if (firstMatch && firstMatch.route && firstMatch.route.notFound) {
        serverContext.nofound = true;
      }
    }
    return context;
  };
}

module.exports.render = async (
  req,
  routes,
  context,
  renderApp,
  webExtractor,
  preloadedState = {},
  config = {}
) => {
  const fetchRequest = createFetchRequestForServer(req);
  //This is important as we don't want to set refernce for collectchunk to anything other than webExtractor.
  const collectWebChunk = webExtractor.collectChunks.bind(webExtractor);
  console.log(req.url);
  const data = await renderApp(
    { url: req.url },
    routes,
    context,
    collectWebChunk,
    preloadedState,
    config
  );
  if (!data) {
    return null;
  }
  console.log(context);
  // Preloaded state needs to be passed for client side too.
  // For security reasons we ensure that preloaded state is considered as a string
  // by replacing '<' character with its unicode equivalent.
  // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
  const serializeData = JSON.stringify(preloadedState).replace(/</g, "\\u003c");

  // At this point the serializedState is a string, the second
  // JSON.stringify wraps it within double quotes and escapes the
  // contents properly so the value can be injected in the script tag
  // as a string.
  const preloadedStateScript = `
      <script>window.__PRELOADED_STATE__ = ${JSON.stringify(
        serializeData
      )};</script>
  `;

  const { body, head } = data;

  const templateData = {
    body,
    htmlAttributes: head.htmlAttributes.toString(),
    links: head.link.toString(),
    meta: head.meta.toString(),
    title: head.title.toString(),
    script: head.script.toString(),
    ssrLinks: webExtractor.getLinkTags(),
    ssrStyles: webExtractor.getStyleTags(),
    ssrScript: webExtractor.getScriptTags(),
    preloadedStateScript,
  };
  return template(templateData);
};

module.exports.getExtractor = () => {
  const nodeStatsFile = path.resolve(buildPath, "node", "loadable-stats.json");
  const webStatsFile = path.resolve(buildPath, "loadable-stats.json");
  const nodeExtractor = new CustomChunkExtractor({ statsFile: nodeStatsFile });
  const webExtractor = new CustomChunkExtractor({ statsFile: webStatsFile });

  return { nodeExtractor, webExtractor };
};

module.exports.dataLoader = async (
  request,
  routes,
  matchPathName,
  createStore,
  currentUser,
  setCurrentUser,
  setAuthenticationState
) => {
  const { pathname, query } = url.parse(request.url);
  const store = createStore();
  const isAuthenticated = await isCurrentUserAuthenticated(currentUser);
  store.dispatch(setCurrentUser(currentUser));
  store.dispatch(setAuthenticationState(isAuthenticated));
  try {
    const matchedRoutes = matchPathName(pathname, routes);
    const promiseCalls = matchedRoutes.reduce((acc, matchedRoute) => {
      if (
        matchedRoute &&
        matchedRoute.route &&
        matchedRoute.route.element !== null &&
        typeof matchedRoute.route.loader === "function"
      ) {
        const { params } = matchedRoute;
        const search = parseQueryString(query);
        const loaderWithDispatch = matchedRoute.route.loader({
          dispatch: store.dispatch,
          getState: store.getState,
          params,
          search,
        });
        acc.push(loaderWithDispatch);
      }
      return acc;
    }, []);

    await Promise.all(promiseCalls);
    const state = store.getState();
    return state;
  } catch (err) {
    console.error(err, "server side data loading failed");
    store.getState();
  }
};
