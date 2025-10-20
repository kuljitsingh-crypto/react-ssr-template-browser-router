exports.modifyChunkName = function (pathData, assetInfo) {
  if (pathData.chunk.name === "main" || !pathData.chunk.name) {
    return "static/js/[name].[contenthash:8].chunk.js";
  }
  let namesArr = pathData.chunk.name.split("-");
  if (namesArr[0].toLowerCase() === "pages") {
    pathData.chunk.name = namesArr[1];
  }
  return "static/js/[name].[contenthash:8].chunk.js";
};
