module.exports = module.exports = {
  plugins: [
    [
      require.resolve("babel-plugin-module-resolver"),
      {
        cwd: "babelrc",
        extensions: [".ts", ".tsx", ".js"],
        alias: {
          "@src": "./src",
        },
      },
    ],
  ],
};
