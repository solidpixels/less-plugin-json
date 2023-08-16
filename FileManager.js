// lessc style.less --plugin=index.js
const fs = require('fs');
const { getPath } = require('./util');

module.exports = function (less) {
  const FileManager = function (filesCache) {
    this._filesCache = filesCache;
  };

  FileManager.prototype = new less.FileManager();

  FileManager.prototype.loadFile = function (filename, currentDirectory, options, environment) {
    // Check filename again, some environments (ie. Gulp) skip `supports` method.
    if (!filename.match(/\.json?$/)) {
      return false;
    }

    return new Promise((resolve, reject) => {
      try {
        const filePath = getPath(filename, currentDirectory);
        let fileContent = fs.readFileSync(filePath, 'utf8');
        fileContent = JSON.parse(fileContent);
        this._filesCache[filePath] = fileContent;
        resolve({ contents: '', filename });
      } catch (err) {
        reject(new Error('Can\'t generate JSON variables file.'))
      }
    });
  };

  FileManager.prototype.supports = function (filename, currentDirectory, options, environment) {
    if (!filename.match(/\.json?$/)) {
      return false;
    }

    try {
      const filePath = getPath(filename, currentDirectory);
      const stat = fs.statSync(filePath);
      return stat.isFile();
    } catch (err) {
      console.log(err);
    }

    return false;
  };

  FileManager.prototype.tryAppendExtension = function (filename, ext) {
    return filename;
  };

  return FileManager;
};
