const path = require("path");

module.exports = {
  devServer: {
    before(app, server) {
      require('mocker-api')(app, path.resolve('./mocks/api'));
    }
  }
};
