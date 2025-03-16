module.exports = function (api) {
  api.cache(true);

  return {
    plugins: [],
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
