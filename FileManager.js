// lessc style.less --plugin=index.js
const fs = require('fs');
const path = require('path');

module.exports = function(less) {
  const FileManager = function() {};

  FileManager.prototype = new less.FileManager();
  
  FileManager.prototype.stringify = function(obj) {
    if (!obj) {
      throw new Error('Undefined variable');
    }
    // LESS does not support recursive maps
    if (obj instanceof Array) {
      return obj.join(',');
    }
    return `{${Object.keys(obj).map((key) => `${key}:${obj[key]}`).join(';')}}`;
  };
  
  FileManager.prototype.transformVariables = function(obj) {
    const result = [];
    const transform = (innerObj, prefix = []) => {
      if (prefix[0] && prefix[0].substr(0, 1) === '$') {
        result.push(`@${prefix[0].substr(1)}:${this.stringify(innerObj)};`);
        return;
      }
  
      if (innerObj && typeof innerObj === 'object') {
        for (let i = 0, keys = Object.keys(innerObj); i < keys.length; i++) {
          const key = keys[i];
          transform(innerObj[key], prefix.concat(key))
        }
        return;
      }
  
      result.push(`@${prefix.join('--')}:${innerObj};`);
      return;
    }
  
    transform(obj);
  
    return result;
  };
  
  FileManager.prototype.getPath = function(filename, currentDirectory) {
    if (path.isAbsolute(filename)) {
      return filename;
    }
    return currentDirectory ? path.resolve(currentDirectory, filename) : undefined
  }
  
  FileManager.prototype.loadFile = function(filename, currentDirectory, options, environment) {
    // Check filename again, some environments (ie. Gulp) skip `supports` method.
    if (!filename.match(/\.json?$/)) {
      return false;
    }
  
    return new Promise((resolve, reject) => {
      let contents;
      try {
        const absolutePath = this.getPath(filename, currentDirectory)
        if (!absolutePath) {
          throw new Error();
        }

        if (this.checkPrefix && !this.checkPrefix(absolutePath, options.restrictedPaths ?? [])) {
          throw new Error();
        }

        const fileContent = require(this.getPath(filename, currentDirectory));
        contents = this.transformVariables(fileContent).join('');
      } catch (err) {
        reject({ type: 'File', message: `Cannot load '${filename}'.` });
      }
  
      if (contents) {
        resolve({ contents, filename });
      } else {
        reject({ type: 'File', message: 'Can\'t generate JSON variables file.' })
      }
    });
  };
  
  FileManager.prototype.supports = function(filename, currentDirectory, options, environment) {
    return !!filename.match(/\.json?$/);
  };
  
  FileManager.prototype.tryAppendExtension = function(filename, ext) {
    return filename;
  };

  return FileManager;
};
