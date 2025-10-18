const fs = require("fs-extra");

exports.modifyChunkContent = function (data, fileName) {
  Object.entries(data.namedChunkGroups).reduce((acc, [key, value]) => {
    if (key.toLowerCase().startsWith("pages")) {
      const pageName = key.split("-")[1];
      if (acc[pageName] === undefined) {
        value.name = pageName;
        acc[pageName] = value;
      } else {
        const refValue = acc[pageName];
        const preLen = refValue.chunks.length;
        const chunks = new Set(refValue.chunks);
        value.chunks.forEach((chunk) => {
          if (!chunks.has(chunk)) {
            refValue.chunks.push(chunk);
          }
        });
        if (refValue.chunks.length !== preLen) {
          refValue.assets.push(...value.assets);
        }
      }
      delete acc[key];
    }
    return acc;
  }, data.namedChunkGroups);
  return fs.writeJson(fileName, data);
};
