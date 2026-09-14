const {
  override,
  fixBabelImports,
  addLessLoader,
  disableChunk,
} = require("customize-cra"); //, addWebpackAlias
//const path = require('path');

module.exports = override(
  disableChunk(),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "#3d7350",
      "@menu-dark-bg": "#191818",
      "@layout-sider-background": "#191818",
    },
  })
  //addWebpackAlias({
  //    ['moment']: path.resolve(__dirname, 'moment-jalaali')
  //})
);
