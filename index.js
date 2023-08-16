// lessc style.less --plugin=index.js
const FileManager = require('./FileManager.js');
const ImportVisitor = require('./ImportVisitor.js');

module.exports = {
  minVersion: [3, 9, 0],
  install: function (less, pluginManager) {
    const filesCache = {};
    pluginManager.addFileManager(new FileManager(less)(filesCache));
    pluginManager.addVisitor(new ImportVisitor(less)(filesCache));
  },
};
