// lessc style.less --plugin=index.js
const FileManager = require('./FileManager.js');

module.exports = {
  minVersion: [2, 5, 0],
  install: function(less, pluginManager) {
    pluginManager.addFileManager(new FileManager());
  },
};
