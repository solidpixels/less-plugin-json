// lessc style.less --plugin=index.js
const getFileManager = require('./FileManager.js');

module.exports = {
  minVersion: [2, 5, 0],
  install: function(less, pluginManager) {
    const FileManager = getFileManager(less);
    pluginManager.addFileManager(new FileManager());
  },
};
